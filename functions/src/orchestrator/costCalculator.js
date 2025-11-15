/**
 * Cost Calculator
 * Calcula y trackea costos de procesamiento IA
 */

const admin = require('firebase-admin');
const { getAgent } = require('./agentRegistry');
const logger = require('firebase-functions/logger');

/**
 * Calcular costo estimado antes de ejecutar
 * @param {string} agentId - ID del agente
 * @param {Object} input - Input data (para estimar tamaño)
 * @returns {number} Costo estimado en USD
 */
function estimateCost(agentId, input = {}) {
    const agent = getAgent(agentId);

    if (!agent) {
        return 0;
    }

    // Costo base por run
    let cost = agent.costPerRun;

    // Ajustar según cantidad de archivos (si aplica)
    if (input.files && Array.isArray(input.files)) {
        const fileCount = input.files.length;
        if (fileCount > 1) {
            // Costo adicional por archivo extra
            cost += (fileCount - 1) * (agent.costPerRun * 0.8);
        }
    }

    return parseFloat(cost.toFixed(4));
}

/**
 * Registrar costo real después de ejecutar
 * @param {string} userId - ID del usuario
 * @param {string} jobId - ID del job
 * @param {string} agentId - ID del agente
 * @param {string} provider - Provider usado
 * @param {number} actualCost - Costo real en USD
 */
async function trackCost(userId, jobId, agentId, provider, actualCost) {
    try {
        const db = admin.firestore();
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Actualizar costo del usuario este mes
        await db.collection('users').doc(userId).update({
            totalCostThisMonth: admin.firestore.FieldValue.increment(actualCost),
            totalRequestsThisMonth: admin.firestore.FieldValue.increment(1),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Registrar en costTracking diario
        const costTrackingRef = db.collection('costTracking').doc(today);

        await costTrackingRef.set({
            totalCost: admin.firestore.FieldValue.increment(actualCost),
            totalRequests: admin.firestore.FieldValue.increment(1),
            [`byUser.${userId}`]: admin.firestore.FieldValue.increment(actualCost),
            [`byProvider.${provider}`]: admin.firestore.FieldValue.increment(actualCost),
            [`byAgent.${agentId}`]: admin.firestore.FieldValue.increment(actualCost),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });

        logger.info('Cost tracked', {
            userId,
            jobId,
            agentId,
            provider,
            cost: actualCost,
        });
    } catch (error) {
        logger.error('Error tracking cost:', error);
        // No fallar el job si falla el tracking
    }
}

/**
 * Obtener costo total del usuario este mes
 * @param {string} userId - ID del usuario
 * @returns {Promise<number>} Costo total en USD
 */
async function getUserMonthlyCost(userId) {
    try {
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        if (!userDoc.exists) {
            return 0;
        }

        return userDoc.data().totalCostThisMonth || 0;
    } catch (error) {
        logger.error('Error getting user monthly cost:', error);
        return 0;
    }
}

/**
 * Verificar si usuario puede ejecutar más jobs (límite de costo)
 * @param {string} userId - ID del usuario
 * @param {number} estimatedCost - Costo estimado del próximo job
 * @returns {Promise<boolean>} true si puede ejecutar
 */
async function canUserExecute(userId, estimatedCost) {
    try {
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        if (!userDoc.exists) {
            return false;
        }

        const user = userDoc.data();
        const currentCost = user.totalCostThisMonth || 0;

        // Límites por tier (USD/mes)
        const limits = {
            client_demo: 5,
            client_basic: 50,
            client_pro: 200,
            client_enterprise: 1000,
            admin: 999999,
        };

        const userLimit = limits[user.role] || limits.client_demo;

        return (currentCost + estimatedCost) <= userLimit;
    } catch (error) {
        logger.error('Error checking user execution limit:', error);
        return false;
    }
}

module.exports = {
    estimateCost,
    trackCost,
    getUserMonthlyCost,
    canUserExecute,
};