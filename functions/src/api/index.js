/**
 * API Index
 * Express app que maneja todas las rutas de la API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Middleware
const { authenticate } = require('./middleware/auth');
const { createTierLimiter, basicLimiter } = require('./middleware/rateLimiter');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Routes
const userRoutes = require('./routes/user');
const uploadRoutes = require('./routes/upload');
const jobsRoutes = require('./routes/jobs');

/**
 * Crear y configurar la aplicación Express
 */
function createApp() {
    const app = express();

    // ===== SEGURIDAD =====

    // Helmet para headers de seguridad
    app.use(helmet());

    // CORS - permitir requests desde tu dominio
    app.use(cors({
        origin: [
            'https://julioduhaldeconsulting.com.ar',
            'http://localhost:5000', // Para desarrollo local
        ],
        credentials: true,
    }));

    // ===== PARSERS =====

    // Parse JSON bodies
    app.use(express.json({ limit: '10mb' }));

    // Parse URL-encoded bodies
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // ===== LOGGING =====

    // Log todas las requests
    app.use(requestLogger);

    // ===== HEALTH CHECK (público) =====

    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'jd-consulting-api',
            version: '1.0.0',
        });
    });

    app.get('/ping', (req, res) => {
        res.send('pong');
    });

    // ===== RUTAS PÚBLICAS =====

    // Endpoint público para listar agentes disponibles
    app.get('/agents', basicLimiter, (req, res) => {
        const { listAgents } = require('../orchestrator/agentRegistry');

        const agents = listAgents({ activeOnly: true });

        res.json({
            success: true,
            data: agents,
            count: agents.length,
        });
    });

    // ===== RUTAS PROTEGIDAS =====

    // Todas las rutas /api/* requieren autenticación
    app.use('/api/user', authenticate, createTierLimiter(), userRoutes);
    app.use('/api/upload', authenticate, createTierLimiter(), uploadRoutes);
    app.use('/api/jobs', authenticate, createTierLimiter(), jobsRoutes);

    // ===== ERROR HANDLING =====

    // 404 para rutas no encontradas
    app.use(notFoundHandler);

    // Logger de errores
    app.use(errorLogger);

    // Error handler centralizado
    app.use(errorHandler);

    return app;
}

module.exports = { createApp };