/**
 * Authentication Middleware
 * Verifica token de Firebase Auth y agrega user info al request
 */

const admin = require('firebase-admin');

/**
 * Middleware para verificar autenticación
 * Extrae el token del header Authorization y verifica con Firebase Auth
 */
async function authenticate(req, res, next) {
    try {
        // Extraer token del header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Token de autenticación no proporcionado'
            });
        }

        const token = authHeader.split('Bearer ')[1];

        // Verificar token con Firebase Auth
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Agregar info del usuario al request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || 'client_demo',
            status: decodedToken.status || 'trial',
            features: decodedToken.features || [],
        };

        next();
    } catch (error) {
        console.error('Error en autenticación:', error);

        // Diferentes mensajes según el tipo de error
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({
                error: 'TokenExpired',
                message: 'Token de autenticación expirado'
            });
        }

        if (error.code === 'auth/argument-error') {
            return res.status(401).json({
                error: 'InvalidToken',
                message: 'Token de autenticación inválido'
            });
        }

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Error verificando autenticación'
        });
    }
}

/**
 * Middleware para verificar rol específico
 * @param {string|Array} allowedRoles - Rol(es) permitido(s)
 */
function requireRole(allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Usuario no autenticado'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}`
            });
        }

        next();
    };
}

/**
 * Middleware para verificar que cuenta esté activa
 */
function requireActiveAccount(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Usuario no autenticado'
        });
    }

    const validStatuses = ['trial', 'paid'];

    if (!validStatuses.includes(req.user.status)) {
        return res.status(403).json({
            error: 'AccountInactive',
            message: 'Tu cuenta está suspendida o cancelada. Contactá soporte.'
        });
    }

    next();
}

/**
 * Middleware para verificar acceso a feature específico
 * @param {string} featureName - Nombre del feature requerido
 */
function requireFeature(featureName) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Usuario no autenticado'
            });
        }

        // Admin tiene acceso a todo
        if (req.user.role === 'admin') {
            return next();
        }

        if (!req.user.features.includes(featureName)) {
            return res.status(403).json({
                error: 'FeatureNotAvailable',
                message: `No tenés acceso a la funcionalidad: ${featureName}`,
                upgradeUrl: '/pricing'
            });
        }

        next();
    };
}

module.exports = {
    authenticate,
    requireRole,
    requireActiveAccount,
    requireFeature,
};