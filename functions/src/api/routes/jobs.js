/**
 * Jobs Routes
 * Endpoints para gestión de trabajos de procesamiento IA
 */

const express = require('express');
const router = express.Router();
const { addDocument, getDocument, queryDocuments, setDocument } = require('../../utils/firestore');
const { AppError } = require('../middleware/errorHandler');
const admin = require('firebase-admin');

/**
 * POST /api/jobs
 * Crear un nuevo job de procesamiento
 */
router.post('/', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { agentType, inputData, inputFiles } = req.body;

        // Validaciones
        if (!agentType) {
            throw new AppError('agentType es requerido', 400);
        }

        // Verificar que el usuario tenga acceso a este agente
        const user = await getDocument('users', userId);

        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }

        // Admin tiene acceso a todo
        if (user.role !== 'admin' && !user.features.includes(agentType)) {
            throw new AppError(`No tenés acceso al agente: ${agentType}`, 403, {
                upgradeUrl: '/pricing',
            });
        }

        // Verificar que cuenta esté activa
        if (!['trial', 'paid'].includes(user.status)) {
            throw new AppError('Tu cuenta no está activa', 403);
        }

        // Obtener info del agente
        const agent = await getDocument('agents', agentType);

        if (!agent || !agent.isActive) {
            throw new AppError('Agente no disponible', 404);
        }

        // Crear job
        const jobId = await addDocument(`users/${userId}/jobs`, {
            agentType,
            agentName: agent.name,
            status: 'queued',
            inputData: inputData || {},
            inputFiles: inputFiles || [],
            aiProvider: agent.preferredProvider,
            usedFallback: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // TODO: Aquí se dispararía la Cloud Function de procesamiento
        // Por ahora solo creamos el job

        res.status(201).json({
            success: true,
            message: 'Job creado exitosamente',
            data: {
                jobId,
                status: 'queued',
                estimatedTime: agent.avgProcessingTime,
                estimatedCost: agent.costPerRun,
            },
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/jobs
 * Listar jobs del usuario
 */
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { status, agentType, limit = 50 } = req.query;

        // Construir filtros
        const filters = [];
        if (status) {
            filters.push(['status', '==', status]);
        }
        if (agentType) {
            filters.push(['agentType', '==', agentType]);
        }

        // Obtener jobs
        const jobs = await queryDocuments(
            `users/${userId}/jobs`,
            filters,
            parseInt(limit)
        );

        res.json({
            success: true,
            data: jobs,
            count: jobs.length,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/jobs/:jobId
 * Obtener detalles de un job específico
 */
router.get('/:jobId', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { jobId } = req.params;

        const job = await getDocument(`users/${userId}/jobs`, jobId);

        if (!job) {
            throw new AppError('Job no encontrado', 404);
        }

        res.json({
            success: true,
            data: job,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/jobs/:jobId
 * Cancelar un job (solo si está en queued o processing)
 */
router.delete('/:jobId', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { jobId } = req.params;

        const job = await getDocument(`users/${userId}/jobs`, jobId);

        if (!job) {
            throw new AppError('Job no encontrado', 404);
        }

        // Solo se pueden cancelar jobs en ciertos estados
        if (!['queued', 'processing'].includes(job.status)) {
            throw new AppError('Este job no puede ser cancelado', 400);
        }

        // Actualizar status a cancelled
        await setDocument(`users/${userId}/jobs`, jobId, {
            status: 'cancelled',
            cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
        }, true);

        res.json({
            success: true,
            message: 'Job cancelado',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;