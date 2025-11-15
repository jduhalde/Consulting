/**
 * Error Handler Middleware
 * Manejo centralizado de errores
 */

const logger = require('firebase-functions/logger');

/**
 * Middleware de manejo de errores
 * Debe ser el último middleware en la cadena
 */
function errorHandler(err, req, res, next) {
    // Si ya se envió la respuesta, delegar al error handler por defecto
    if (res.headersSent) {
        return next(err);
    }

    // Log del error
    logger.error('Error caught by error handler', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.uid || 'anonymous',
    });

    // Determinar status code
    const statusCode = err.statusCode || err.status || 500;

    // Respuesta de error estandarizada
    const errorResponse = {
        error: err.name || 'InternalServerError',
        message: err.message || 'Error interno del servidor',
    };

    // En desarrollo, incluir stack trace
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Agregar info adicional si existe
    if (err.details) {
        errorResponse.details = err.details;
    }

    res.status(statusCode).json(errorResponse);
}

/**
 * Handler para rutas no encontradas (404)
 */
function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'NotFound',
        message: `Ruta no encontrada: ${req.method} ${req.path}`,
    });
}

/**
 * Crear error personalizado con status code
 */
class AppError extends Error {
    constructor(message, statusCode = 500, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    errorHandler,
    notFoundHandler,
    AppError,
};