/**
 * Upload Routes
 * Endpoints para gestión de archivos
 */

const express = require('express');
const router = express.Router();
const { addDocument, getDocument, queryDocuments } = require('../../utils/firestore');
const { getSignedUrl, getFileMetadata } = require('../../utils/storage');
const { AppError } = require('../middleware/errorHandler');
const admin = require('firebase-admin');

/**
 * POST /api/upload/init
 * Iniciar proceso de upload (genera URL firmada para subir)
 */
router.post('/init', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { fileName, fileType, category } = req.body;

        // Validaciones
        if (!fileName || !fileType) {
            throw new AppError('fileName y fileType son requeridos', 400);
        }

        // Generar path único para el archivo
        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `users/${userId}/uploads/${timestamp}_${sanitizedFileName}`;

        // Crear documento en Firestore
        const uploadId = await addDocument(`users/${userId}/uploads`, {
            fileName: fileName,
            fileType: fileType,
            category: category || 'general',
            storageUrl: filePath,
            status: 'pending',
            uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Generar signed URL para upload (válida 15 minutos)
        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);

        const [uploadUrl] = await file.getSignedUrl({
            version: 'v4',
            action: 'write',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutos
            contentType: fileType,
        });

        res.json({
            success: true,
            data: {
                uploadId,
                uploadUrl,
                filePath,
                expiresIn: '15 minutos',
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/upload/complete
 * Marcar upload como completado
 */
router.post('/complete', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { uploadId, filePath } = req.body;

        if (!uploadId || !filePath) {
            throw new AppError('uploadId y filePath son requeridos', 400);
        }

        // Verificar que el archivo exista en Storage
        const metadata = await getFileMetadata(filePath);

        // Actualizar documento en Firestore
        const uploadRef = admin.firestore()
            .collection('users')
            .doc(userId)
            .collection('uploads')
            .doc(uploadId);

        await uploadRef.update({
            status: 'completed',
            fileSize: metadata.size,
            completedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.json({
            success: true,
            message: 'Upload completado',
            data: {
                uploadId,
                fileSize: metadata.size,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/upload
 * Listar archivos subidos por el usuario
 */
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { category, limit = 50 } = req.query;

        // Construir filtros
        const filters = [];
        if (category) {
            filters.push(['category', '==', category]);
        }

        // Obtener uploads
        const uploads = await queryDocuments(
            `users/${userId}/uploads`,
            filters,
            parseInt(limit)
        );

        res.json({
            success: true,
            data: uploads,
            count: uploads.length,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/upload/:uploadId
 * Obtener detalles de un upload específico
 */
router.get('/:uploadId', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { uploadId } = req.params;

        const upload = await getDocument(`users/${userId}/uploads`, uploadId);

        if (!upload) {
            throw new AppError('Upload no encontrado', 404);
        }

        // Generar signed URL para descarga (válida 1 hora)
        const downloadUrl = await getSignedUrl(upload.storageUrl, 60);

        res.json({
            success: true,
            data: {
                ...upload,
                downloadUrl,
            },
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;