// ========================================
// CONFIGURACIÓN GLOBAL - Portal Multi-Servicio IA
// ========================================

const CONFIG = {
    // ===== MODO DE OPERACIÓN =====
    // true = Muestra los 16 agentes (desarrollo)
    // false = Solo muestra agentes activos (producción)
    SHOW_ALL_AGENTS: true,

    // ===== BACKEND CONFIGURATION =====
    // Cambiar según entorno
    BACKEND: {
        // Local development (Firebase Emulators)
        LOCAL: {
            API_URL: 'http://localhost:5001/jd-consultora-ia/us-central1/api',
            STORAGE_URL: 'http://localhost:9199',
            FIRESTORE_URL: 'http://localhost:8080'
        },

        // Production (Firebase Cloud)
        PRODUCTION: {
            API_URL: 'https://us-central1-jd-consultora-ia.cloudfunctions.net/api',
            STORAGE_URL: 'https://firebasestorage.googleapis.com',
            FIRESTORE_URL: 'https://firestore.googleapis.com'
        }
    },

    // ===== CURRENT ENVIRONMENT =====
    // 'LOCAL' durante desarrollo
    // 'PRODUCTION' cuando deploys
    CURRENT_ENV: 'LOCAL',

    // ===== FIREBASE CONFIG (reemplazar con tu proyecto) =====
    FIREBASE: {
        apiKey: "YOUR-API-KEY",
        authDomain: "jd-consultora-ia.firebaseapp.com",
        projectId: "jd-consultora-ia",
        storageBucket: "jd-consultora-ia.appspot.com",
        messagingSenderId: "YOUR-SENDER-ID",
        appId: "YOUR-APP-ID"
    },

    // ===== FEATURES FLAGS =====
    FEATURES: {
        ENABLE_AUTH: false,          // true cuando Firebase Auth esté configurado
        ENABLE_UPLOADS: true,         // Permitir subir archivos
        ENABLE_DOWNLOADS: true,       // Permitir descargar resultados
        ENABLE_REALTIME_UPDATES: false, // true para Firestore listeners
        ENABLE_NOTIFICATIONS: false,  // true para push notifications
        ENABLE_ANALYTICS: false       // true para tracking de uso
    },

    // ===== UI SETTINGS =====
    UI: {
        JOBS_PER_PAGE: 10,
        AUTO_REFRESH_INTERVAL: 5000, // ms (5 segundos)
        MAX_FILE_SIZE: 50 * 1024 * 1024, // 50 MB
        ALLOWED_FILE_TYPES: [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
            'application/vnd.ms-excel', // XLS
            'text/csv',
            'application/msword', // DOC
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // DOCX
        ]
    },

    // ===== AGENT CATEGORIES =====
    CATEGORIES: {
        FINANZAS: 'Finanzas & Contabilidad',
        INDUSTRIA: 'Industria 4.0',
        CHATBOTS: 'Chatbots & Asistentes',
        COMPLIANCE: 'Compliance & Regulatorio',
        OPERACIONES: 'Operaciones & Productividad',
        MARKETING: 'Marketing & Ventas'
    },

    // ===== HELPER METHODS =====
    getApiUrl() {
        return this.BACKEND[this.CURRENT_ENV].API_URL;
    },

    getStorageUrl() {
        return this.BACKEND[this.CURRENT_ENV].STORAGE_URL;
    },

    isProduction() {
        return this.CURRENT_ENV === 'PRODUCTION';
    },

    isDevelopment() {
        return this.CURRENT_ENV === 'LOCAL';
    }
};

// Hacer CONFIG disponible globalmente
if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
}

// Log de configuración en desarrollo
if (CONFIG.isDevelopment()) {
    console.log('🔧 MODO DESARROLLO ACTIVO');
    console.log('📊 Mostrando todos los agentes:', CONFIG.SHOW_ALL_AGENTS);
    console.log('🌐 API URL:', CONFIG.getApiUrl());
    console.log('💾 Features habilitados:', CONFIG.FEATURES);
}