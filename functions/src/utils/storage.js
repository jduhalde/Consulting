/**
 * Storage Utilities
 * Helper functions para operaciones con Firebase Storage
 */

const admin = require('firebase-admin');

/**
 * Generar URL firmada para descarga de archivo
 */
async function getSignedUrl(filePath, expiresInMinutes = 60) {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);

        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + (expiresInMinutes * 60 * 1000),
        });

        return url;
    } catch (error) {
        console.error(`Error generating signed URL for ${filePath}:`, error);
        throw error;
    }
}

/**
 * Verificar si archivo existe en Storage
 */
async function fileExists(filePath) {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);
        const [exists] = await file.exists();
        return exists;
    } catch (error) {
        console.error(`Error checking if file exists ${filePath}:`, error);
        return false;
    }
}

/**
 * Obtener metadata de archivo
 */
async function getFileMetadata(filePath) {
    try {
        const bucket = admin.storage().bucket();
        const file = bucket.file(filePath);
        const [metadata] = await file.getMetadata();

        return {
            name: metadata.name,
            size: parseInt(metadata.size),
            contentType: metadata.contentType,
            timeCreated: metadata.timeCreated,
            updated: metadata.updated,
        };
    } catch (error) {
        console.error(`Error getting metadata for ${filePath}:`, error);
        throw error;
    }
}

module.exports = {
    getSignedUrl,
    fileExists,
    getFileMetadata,
};