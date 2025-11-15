/**
 * Provider Router
 * Decide qué provider de IA usar (Vertex/Azure/AWS) y maneja fallbacks
 */

const { getAgent } = require('./agentRegistry');
const logger = require('firebase-functions/logger');

/**
 * Determinar qué provider usar para un agente
 * @param {string} agentId - ID del agente
 * @param {Object} options - Opciones (forceProvider, etc.)
 * @returns {string} Provider seleccionado
 */
function selectProvider(agentId, options = {}) {
    const agent = getAgent(agentId);

    if (!agent) {
        throw new Error(`Agente no encontrado: ${agentId}`);
    }

    // Si se fuerza un provider específico
    if (options.forceProvider) {
        if (!agent.providers.includes(options.forceProvider)) {
            throw new Error(`Provider ${options.forceProvider} no disponible para ${agentId}`);
        }
        return options.forceProvider;
    }

    // Usar provider preferido
    return agent.preferredProvider;
}

/**
 * Obtener provider de fallback
 * @param {string} agentId - ID del agente
 * @param {string} failedProvider - Provider que falló
 * @returns {string|null} Provider de fallback o null
 */
function getFallbackProvider(agentId, failedProvider) {
    const agent = getAgent(agentId);

    if (!agent) {
        return null;
    }

    // Si el que falló fue el preferido, usar el fallback definido
    if (failedProvider === agent.preferredProvider) {
        return agent.fallbackProvider;
    }

    // Si falló el fallback, intentar con otro disponible
    const availableProviders = agent.providers.filter(
        p => p !== failedProvider && p !== agent.preferredProvider
    );

    return availableProviders.length > 0 ? availableProviders[0] : null;
}

/**
 * Ejecutar lógica de procesamiento con un provider
 * NOTA: Esta es una función placeholder
 * En producción, aquí se llamaría a Vertex AI, Azure OpenAI, o AWS Bedrock
 * 
 * @param {string} provider - Provider a usar
 * @param {string} agentId - ID del agente
 * @param {Object} input - Datos de entrada
 * @returns {Promise<Object>} Resultado del procesamiento
 */
async function executeWithProvider(provider, agentId, input) {
    logger.info(`Executing ${agentId} with ${provider}`);

    // TODO: Implementar llamadas reales a cada provider
    // Por ahora, retornamos un mock

    switch (provider) {
        case 'vertex':
            return await executeWithVertex(agentId, input);

        case 'azure':
            return await executeWithAzure(agentId, input);

        case 'aws':
            return await executeWithAWS(agentId, input);

        default:
            throw new Error(`Provider desconocido: ${provider}`);
    }
}

/**
 * Ejecutar con Vertex AI (Google Cloud)
 * PLACEHOLDER - Implementar en producción
 */
async function executeWithVertex(agentId, input) {
    logger.info(`[VERTEX] Processing ${agentId}`);

    // TODO: Implementar llamada a Vertex AI
    // const vertexAI = require('@google-cloud/aiplatform');

    return {
        provider: 'vertex',
        status: 'completed',
        result: {
            message: 'Procesado con Vertex AI (mock)',
            agentId,
            input,
        },
    };
}

/**
 * Ejecutar con Azure OpenAI
 * PLACEHOLDER - Implementar en producción
 */
async function executeWithAzure(agentId, input) {
    logger.info(`[AZURE] Processing ${agentId}`);

    // TODO: Implementar llamada a Azure OpenAI
    // const { OpenAIClient } = require("@azure/openai");

    return {
        provider: 'azure',
        status: 'completed',
        result: {
            message: 'Procesado con Azure OpenAI (mock)',
            agentId,
            input,
        },
    };
}

/**
 * Ejecutar con AWS Bedrock
 * PLACEHOLDER - Implementar en producción
 */
async function executeWithAWS(agentId, input) {
    logger.info(`[AWS] Processing ${agentId}`);

    // TODO: Implementar llamada a AWS Bedrock
    // const { BedrockClient } = require("@aws-sdk/client-bedrock");

    return {
        provider: 'aws',
        status: 'completed',
        result: {
            message: 'Procesado con AWS Bedrock (mock)',
            agentId,
            input,
        },
    };
}

/**
 * Ejecutar con auto-fallback
 * Si el provider preferido falla, intenta con fallback automáticamente
 */
async function executeWithFallback(agentId, input, options = {}) {
    const provider = selectProvider(agentId, options);
    let usedFallback = false;

    try {
        // Intentar con provider seleccionado
        const result = await executeWithProvider(provider, agentId, input);
        return { ...result, usedFallback };
    } catch (error) {
        logger.error(`Provider ${provider} failed for ${agentId}:`, error);

        // Intentar con fallback
        const fallbackProvider = getFallbackProvider(agentId, provider);

        if (!fallbackProvider) {
            throw new Error(`No hay fallback disponible después de fallo de ${provider}`);
        }

        logger.info(`Trying fallback provider: ${fallbackProvider}`);
        usedFallback = true;

        try {
            const result = await executeWithProvider(fallbackProvider, agentId, input);
            return { ...result, usedFallback, originalProvider: provider };
        } catch (fallbackError) {
            logger.error(`Fallback provider ${fallbackProvider} also failed:`, fallbackError);
            throw new Error('Todos los providers fallaron');
        }
    }
}

module.exports = {
    selectProvider,
    getFallbackProvider,
    executeWithProvider,
    executeWithFallback,
};