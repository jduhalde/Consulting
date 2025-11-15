/**
 * Rate Limiter Middleware
 * Limita requests por usuario según su tier
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter básico (para endpoints públicos)
 */
const basicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requests por ventana
    message: {
        error: 'TooManyRequests',
        message: 'Demasiadas peticiones. Intentá de nuevo en 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Rate limiter por tier de usuario
 */
function createTierLimiter() {
    return rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 100, // Límite genérico (en producción se puede ajustar por tier)
        message: {
            error: 'RateLimitExceeded',
            message: 'Límite de requests excedido.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
}

/**
 * Rate limiter estricto para operaciones costosas
 */
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // Solo 5 por hora
    message: {
        error: 'RateLimitExceeded',
        message: 'Esta operación tiene un límite de 5 requests por hora.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    basicLimiter,
    createTierLimiter,
    strictLimiter,
};