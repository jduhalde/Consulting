/**
 * Cloud Functions for jd-consulting
 * Entry point principal
 */

const { onRequest } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
const logger = require('firebase-functions/logger');

// Inicializar Firebase Admin
admin.initializeApp();

// ===== API PRINCIPAL =====

const { createApp } = require('./src/api');
const app = createApp();

/**
 * Función HTTP principal - API Gateway
 */
exports.api = onRequest(app);

/**
 * Función simple para testing
 */
exports.helloWorld = onRequest((request, response) => {
    logger.info('Hello World called', {
        method: request.method,
        path: request.path,
    });

    response.json({
        message: 'Hello from jd-consulting Functions!',
        timestamp: new Date().toISOString(),
        status: 'operational',
    });
});

/**
 * Función de health check
 */
exports.health = onRequest((request, response) => {
    response.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'jd-consulting',
        version: '1.0.0',
    });
});

/**
 * Trigger cuando se crea un job
 */
exports.onJobCreated = onDocumentCreated(
    'users/{userId}/jobs/{jobId}',
    async (event) => {
        const { userId, jobId } = event.params;
        const jobData = event.data.data();

        logger.info('New job created', {
            userId,
            jobId,
            agentType: jobData.agentType
        });

        try {
            await event.data.ref.update({
                status: 'processing',
                startedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            logger.info('Job processing started', { userId, jobId });
        } catch (error) {
            logger.error('Error starting job:', error);
        }
    }
);

logger.info('Cloud Functions initialized');