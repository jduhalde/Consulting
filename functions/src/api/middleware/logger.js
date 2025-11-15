/**
 * Logger Middleware
 * Logging estructurado de todas las requests
 */

const logger = require('firebase-functions/logger');

/**
 * Middleware de logging
 * Logea información de cada request/response
 */
function requestLogger(req, res, next) {
    const startTime = Date.now();

    // Log de request entrante
    logger.info('Request received', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: req.user?.uid || 'anonymous',
    });

    // Interceptar la respuesta para logear también
    const originalSend = res.send;

    res.send = function (data) {
        const duration = Date.now() - startTime;

        logger.info('Request completed', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?.uid || 'anonymous',
        });

        originalSend.call(this, data);
    };

    next();
}

/**
 * Logger de errores
 * Logea errores con stack trace completo
 */
function errorLogger(err, req, res, next) {
    logger.error('Error in request', {
        method: req.method,
        path: req.path,
        error: err.message,
        stack: err.stack,
        userId: req.user?.uid || 'anonymous',
    });

    next(err);
}

module.exports = {
    requestLogger,
    errorLogger,
};