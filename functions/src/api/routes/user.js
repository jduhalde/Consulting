/**
 * User Routes
 * Endpoints para gestión de usuario
 */

const express = require('express');
const router = express.Router();
const { getDocument, setDocument } = require('../../utils/firestore');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /api/user
 * Obtener información del usuario actual
 */
router.get('/', async (req, res, next) => {
    try {
        const userId = req.user.uid;

        // Obtener datos del usuario de Firestore
        const userData = await getDocument('users', userId);

        if (!userData) {
            throw new AppError('Usuario no encontrado', 404);
        }

        // No enviar datos sensibles
        const { billingInfo, ...safeUserData } = userData;

        res.json({
            success: true,
            data: safeUserData,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/user
 * Actualizar información del usuario
 */
router.put('/', async (req, res, next) => {
    try {
        const userId = req.user.uid;
        const { displayName, company, industry, settings } = req.body;

        // Validar que exista al menos un campo a actualizar
        if (!displayName && !company && !industry && !settings) {
            throw new AppError('No hay datos para actualizar', 400);
        }

        // Preparar datos a actualizar
        const updateData = {};
        if (displayName) updateData.displayName = displayName;
        if (company) updateData.company = company;
        if (industry) updateData.industry = industry;
        if (settings) updateData.settings = settings;

        // Actualizar en Firestore
        await setDocument('users', userId, updateData, true);

        // Obtener datos actualizados
        const updatedUser = await getDocument('users', userId);
        const { billingInfo, ...safeUserData } = updatedUser;

        res.json({
            success: true,
            message: 'Usuario actualizado correctamente',
            data: safeUserData,
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/user/usage
 * Obtener estadísticas de uso del usuario
 */
router.get('/usage', async (req, res, next) => {
    try {
        const userId = req.user.uid;

        const userData = await getDocument('users', userId);

        if (!userData) {
            throw new AppError('Usuario no encontrado', 404);
        }

        const usage = {
            totalCostThisMonth: userData.totalCostThisMonth || 0,
            totalRequestsThisMonth: userData.totalRequestsThisMonth || 0,
            role: userData.role,
            status: userData.status,
            features: userData.features || [],
            trialExpiresAt: userData.trialExpiresAt || null,
        };

        res.json({
            success: true,
            data: usage,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;