/**
 * Agent Registry
 * Catálogo de todos los agentes IA disponibles
 */

/**
 * Registro de agentes
 * Cada agente tiene: id, nombre, categoría, providers, costos, etc.
 */
const agents = {
    // ===== FINANZAS & CONTABILIDAD =====
    facturas_afip: {
        id: 'facturas_afip',
        name: 'Contador IA - Procesador de Facturas AFIP',
        category: 'finanzas',
        type: 'document_processing',
        description: 'Procesa facturas argentinas (A, B, C), valida con AFIP, genera Excel',
        providers: ['vertex', 'azure'],
        preferredProvider: 'vertex',
        fallbackProvider: 'azure',
        inputTypes: ['pdf', 'jpg', 'png'],
        outputTypes: ['xlsx', 'json'],
        features: [
            'OCR alta precisión',
            'Validación AFIP real-time',
            'Extracción datos estructurados',
            'Detección anomalías',
            'Export Excel/ERP'
        ],
        costPerRun: 0.50,
        avgProcessingTime: 30,
        requiresIntegration: ['afip'],
        isActive: true,
    },

    contratos_legales: {
        id: 'contratos_legales',
        name: 'Auditor IA - Analista de Contratos',
        category: 'finanzas',
        type: 'document_analysis',
        description: 'Analiza contratos, identifica cláusulas clave, detecta riesgos',
        providers: ['vertex', 'azure', 'aws'],
        preferredProvider: 'vertex',
        fallbackProvider: 'azure',
        inputTypes: ['pdf', 'docx'],
        outputTypes: ['pdf', 'json'],
        features: [
            'Extracción cláusulas',
            'Análisis de riesgo',
            'Alertas vencimientos',
            'Comparación templates'
        ],
        costPerRun: 1.20,
        avgProcessingTime: 120,
        requiresIntegration: [],
        isActive: true,
    },

    balances_financieros: {
        id: 'balances_financieros',
        name: 'Analista IA - Intérprete de Balances',
        category: 'finanzas',
        type: 'financial_analysis',
        description: 'Lee estados contables, calcula ratios, genera insights',
        providers: ['vertex', 'azure'],
        preferredProvider: 'vertex',
        fallbackProvider: 'azure',
        inputTypes: ['pdf', 'xlsx'],
        outputTypes: ['pdf', 'json'],
        features: [
            'Extracción automática',
            'Cálculo ratios financieros',
            'Análisis temporal',
            'Detección anomalías'
        ],
        costPerRun: 0.80,
        avgProcessingTime: 60,
        requiresIntegration: [],
        isActive: true,
    },

    // ===== INDUSTRIA 4.0 =====
    vision_qa: {
        id: 'vision_qa',
        name: 'Inspector IA - Control de Calidad Visual',
        category: 'industria',
        type: 'computer_vision',
        description: 'Entrena modelos custom, clasifica productos OK/defecto',
        providers: ['vertex', 'azure'],
        preferredProvider: 'vertex',
        fallbackProvider: 'azure',
        inputTypes: ['jpg', 'png'],
        outputTypes: ['json'],
        features: [
            'Training personalizado',
            'Inferencia real-time',
            'Batch processing',
            'Reportes automáticos'
        ],
        costPerRun: 0.003,
        avgProcessingTime: 0.5,
        requiresIntegration: [],
        isActive: true,
    },

    iot_monitoring: {
        id: 'iot_monitoring',
        name: 'Monitor IoT - Análisis de Sensores',
        category: 'industria',
        type: 'time_series',
        description: 'Analiza telemetría IoT, detecta anomalías, predice fallos',
        providers: ['vertex', 'aws'],
        preferredProvider: 'vertex',
        fallbackProvider: 'aws',
        inputTypes: ['json', 'mqtt'],
        outputTypes: ['json'],
        features: [
            'Análisis real-time',
            'Anomaly detection',
            'Predictive maintenance',
            'Alertas multi-canal'
        ],
        costPerRun: 0.001,
        avgProcessingTime: 1,
        requiresIntegration: [],
        isActive: true,
    },

    // ===== CHATBOTS =====
    chatbot_comercial: {
        id: 'chatbot_comercial',
        name: 'Chatbot Comercial - WhatsApp',
        category: 'chatbot',
        type: 'conversational_ai',
        description: 'Bot de ventas/soporte para WhatsApp, RAG con catálogo',
        providers: ['vertex', 'azure'],
        preferredProvider: 'vertex',
        fallbackProvider: 'azure',
        inputTypes: ['text', 'image', 'audio'],
        outputTypes: ['text', 'image'],
        features: [
            'RAG con catálogo',
            'Handoff a humano',
            'Lead capture',
            'Multi-idioma'
        ],
        costPerRun: 0.01,
        avgProcessingTime: 2,
        requiresIntegration: ['whatsapp'],
        isActive: true,
    },

    knowledge_assistant: {
        id: 'knowledge_assistant',
        name: 'Knowledge Assistant - Técnico',
        category: 'chatbot',
        type: 'conversational_ai',
        description: 'Bot técnico interno, responde de manuales vía WhatsApp',
        providers: ['vertex', 'azure'],
        preferredProvider: 'vertex',
        fallbackProvider: 'azure',
        inputTypes: ['text', 'image', 'audio'],
        outputTypes: ['text', 'image'],
        features: [
            'RAG con manuales técnicos',
            'Multi-modal input',
            'Control de acceso',
            'Safety features'
        ],
        costPerRun: 0.02,
        avgProcessingTime: 3,
        requiresIntegration: ['whatsapp'],
        isActive: true,
    },
};

/**
 * Obtener agente por ID
 */
function getAgent(agentId) {
    return agents[agentId] || null;
}

/**
 * Listar todos los agentes
 */
function listAgents(filters = {}) {
    let agentList = Object.values(agents);

    // Filtrar por categoría
    if (filters.category) {
        agentList = agentList.filter(a => a.category === filters.category);
    }

    // Filtrar solo activos
    if (filters.activeOnly) {
        agentList = agentList.filter(a => a.isActive);
    }

    return agentList;
}

/**
 * Verificar si agente existe y está activo
 */
function isAgentAvailable(agentId) {
    const agent = agents[agentId];
    return agent && agent.isActive;
}

module.exports = {
    agents,
    getAgent,
    listAgents,
    isAgentAvailable,
};