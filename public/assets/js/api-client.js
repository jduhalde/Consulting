// ========================================
// API CLIENT - Conexión con Backend
// Firebase Cloud Functions + Firestore
// ========================================

class APIClient {
    constructor() {
        this.baseURL = window.APP_CONFIG.getApiUrl();
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    // ========================================
    // HEALTH CHECK
    // ========================================
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('❌ Backend health check failed:', error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // AGENTS
    // ========================================

    // Obtener todos los agentes del backend
    async getAgents() {
        try {
            const response = await fetch(`${this.baseURL}/agents`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return { success: true, agents: data.agents || [] };
        } catch (error) {
            console.error('❌ Error fetching agents:', error);
            // Fallback a catálogo local si backend no responde
            return {
                success: false,
                agents: window.AGENTS_CATALOG || [],
                fallback: true,
                error: error.message
            };
        }
    }

    // Obtener detalles de un agente específico
    async getAgentDetails(agentId) {
        try {
            const response = await fetch(`${this.baseURL}/agents/${agentId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return { success: true, agent: data };
        } catch (error) {
            console.error(`❌ Error fetching agent ${agentId}:`, error);
            // Fallback a catálogo local
            const agent = window.AgentsAPI.getAgentById(agentId);
            return {
                success: false,
                agent,
                fallback: true,
                error: error.message
            };
        }
    }

    // ========================================
    // FILE UPLOAD
    // ========================================

    async uploadFile(file, agentId, metadata = {}) {
        try {
            // Validar tamaño
            if (file.size > window.APP_CONFIG.UI.MAX_FILE_SIZE) {
                throw new Error(`Archivo muy grande. Máximo ${window.APP_CONFIG.UI.MAX_FILE_SIZE / 1024 / 1024}MB`);
            }

            // Validar tipo
            if (!window.APP_CONFIG.UI.ALLOWED_FILE_TYPES.includes(file.type)) {
                throw new Error(`Tipo de archivo no permitido: ${file.type}`);
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('agentId', agentId);
            formData.append('metadata', JSON.stringify(metadata));

            const response = await fetch(`${this.baseURL}/upload`, {
                method: 'POST',
                body: formData
                // No incluir Content-Type header, FormData lo maneja
            });

            if (!response.ok) throw new Error(`Upload failed: HTTP ${response.status}`);

            const data = await response.json();
            return {
                success: true,
                uploadId: data.uploadId,
                storageUrl: data.storageUrl
            };
        } catch (error) {
            console.error('❌ Error uploading file:', error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // JOBS (Procesamiento IA)
    // ========================================

    // Crear un nuevo job de procesamiento
    async createJob(agentId, inputData, files = []) {
        try {
            const response = await fetch(`${this.baseURL}/jobs`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    agentId,
                    inputData,
                    files
                })
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return {
                success: true,
                jobId: data.jobId,
                status: data.status
            };
        } catch (error) {
            console.error('❌ Error creating job:', error);
            return { success: false, error: error.message };
        }
    }

    // Obtener estado de un job
    async getJobStatus(jobId) {
        try {
            const response = await fetch(`${this.baseURL}/jobs/${jobId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return { success: true, job: data };
        } catch (error) {
            console.error(`❌ Error fetching job ${jobId}:`, error);
            return { success: false, error: error.message };
        }
    }

    // Obtener todos los jobs del usuario
    async getJobs(limit = 20, status = null) {
        try {
            let url = `${this.baseURL}/jobs?limit=${limit}`;
            if (status) url += `&status=${status}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return { success: true, jobs: data.jobs || [] };
        } catch (error) {
            console.error('❌ Error fetching jobs:', error);
            return { success: false, jobs: [], error: error.message };
        }
    }

    // Cancelar un job
    async cancelJob(jobId) {
        try {
            const response = await fetch(`${this.baseURL}/jobs/${jobId}/cancel`, {
                method: 'POST',
                headers: this.headers
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return { success: true, message: data.message };
        } catch (error) {
            console.error(`❌ Error canceling job ${jobId}:`, error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // RESULTS (Descarga de resultados)
    // ========================================

    async getResult(jobId) {
        try {
            const response = await fetch(`${this.baseURL}/results/${jobId}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return {
                success: true,
                resultUrl: data.resultUrl,
                outputData: data.outputData
            };
        } catch (error) {
            console.error(`❌ Error fetching result ${jobId}:`, error);
            return { success: false, error: error.message };
        }
    }

    async downloadResult(resultUrl, filename) {
        try {
            const response = await fetch(resultUrl);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const blob = await response.blob();

            // Trigger download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            return { success: true };
        } catch (error) {
            console.error('❌ Error downloading result:', error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // USER STATS
    // ========================================

    async getUserStats() {
        try {
            const response = await fetch(`${this.baseURL}/user/stats`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            return { success: true, stats: data };
        } catch (error) {
            console.error('❌ Error fetching user stats:', error);
            // Retornar stats vacías como fallback
            return {
                success: false,
                stats: {
                    totalJobs: 0,
                    totalCost: 0,
                    filesProcessed: 0,
                    activeAgents: 7
                },
                error: error.message
            };
        }
    }
}

// ========================================
// FIRESTORE REALTIME (Opcional - para jobs en tiempo real)
// ========================================

class FirestoreClient {
    constructor() {
        this.db = null;
        this.listeners = new Map();
    }

    async init() {
        if (!window.APP_CONFIG.FEATURES.ENABLE_REALTIME_UPDATES) {
            console.log('⚠️ Realtime updates disabled');
            return;
        }

        try {
            // Importar Firebase SDK si está disponible
            if (typeof firebase === 'undefined') {
                console.warn('⚠️ Firebase SDK not loaded, realtime updates disabled');
                return;
            }

            firebase.initializeApp(window.APP_CONFIG.FIREBASE);
            this.db = firebase.firestore();

            console.log('✅ Firestore initialized');
        } catch (error) {
            console.error('❌ Error initializing Firestore:', error);
        }
    }

    // Escuchar cambios en jobs del usuario
    listenToJobs(userId, callback) {
        if (!this.db) {
            console.warn('⚠️ Firestore not initialized');
            return null;
        }

        const unsubscribe = this.db
            .collection('users')
            .doc(userId)
            .collection('jobs')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .onSnapshot(
                (snapshot) => {
                    const jobs = [];
                    snapshot.forEach(doc => {
                        jobs.push({ id: doc.id, ...doc.data() });
                    });
                    callback(jobs);
                },
                (error) => {
                    console.error('❌ Error listening to jobs:', error);
                }
            );

        this.listeners.set('jobs', unsubscribe);
        return unsubscribe;
    }

    // Detener todos los listeners
    stopListening() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners.clear();
    }
}

// ========================================
// EXPORT & INITIALIZATION
// ========================================

// Crear instancias globales
const apiClient = new APIClient();
const firestoreClient = new FirestoreClient();

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
    window.firestoreClient = firestoreClient;
}

// Log en desarrollo
if (typeof window !== 'undefined' && window.APP_CONFIG?.isDevelopment()) {
    console.log('🌐 API Client initialized:', apiClient.baseURL);

    // Test backend connection
    apiClient.checkHealth().then(result => {
        if (result.success) {
            console.log('✅ Backend connection OK:', result.data);
        } else {
            console.warn('⚠️ Backend connection failed, using fallback mode');
        }
    });
}