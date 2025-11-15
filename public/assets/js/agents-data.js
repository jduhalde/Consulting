// ========================================
// CATÁLOGO COMPLETO DE AGENTES IA
// 16 agentes en 6 verticales de negocio
// ========================================

const AGENTS_CATALOG = [
    // ========================================
    // FINANZAS & CONTABILIDAD (4 agentes)
    // ========================================
    {
        id: 'facturas_afip',
        name: 'Contador IA',
        subtitle: 'Procesador de Facturas AFIP',
        category: 'FINANZAS',
        description: 'Procesa facturas argentinas (A, B, C), extrae datos estructurados, valida contra AFIP en tiempo real, detecta anomalías, exporta a Excel/ERP (Tango, Bejerman).',
        icon: '📄',
        color: '#dbeafe',
        cost: '$0.50',
        unit: 'factura',
        avgTime: '30 seg',
        status: 'active', // ✅ ACTIVO
        features: [
            'OCR de alta precisión',
            'Validación AFIP en tiempo real',
            'Detección de facturas apócrifas',
            'Export a Tango, Bejerman, Odoo',
            'Cálculo automático retenciones/percepciones'
        ],
        inputTypes: ['PDF', 'JPG', 'PNG'],
        outputTypes: ['Excel', 'JSON', 'ERP Integration'],
        requiresIntegration: ['afip'],
        providers: ['vertex', 'azure']
    },
    {
        id: 'contratos',
        name: 'Auditor IA',
        subtitle: 'Analista de Contratos Legales',
        category: 'FINANZAS',
        description: 'Lee contratos legales, identifica cláusulas clave, detecta riesgos, alerta vencimientos, compara con templates, genera reportes ejecutivos profesionales.',
        icon: '⚖️',
        color: '#d1fae5',
        cost: '$1.20',
        unit: 'contrato',
        avgTime: '2 min',
        status: 'active', // ✅ ACTIVO
        features: [
            'Extracción de cláusulas críticas',
            'Análisis de riesgo legal',
            'Alertas de vencimiento',
            'Comparación con templates',
            'Reporte ejecutivo PDF'
        ],
        inputTypes: ['PDF', 'DOCX'],
        outputTypes: ['PDF Report', 'JSON'],
        requiresIntegration: [],
        providers: ['gemini', 'gpt4', 'claude']
    },
    {
        id: 'balances',
        name: 'Analista de Balances',
        subtitle: 'Intérprete Financiero',
        category: 'FINANZAS',
        description: 'Lee estados contables, extrae KPIs financieros, calcula ratios de liquidez/rentabilidad/solvencia, detecta anomalías, genera insights accionables.',
        icon: '💼',
        color: '#dbeafe',
        cost: '$0.80',
        unit: 'balance',
        avgTime: '1 min',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Extracción automática de EECC',
            'Cálculo de 20+ ratios financieros',
            'Análisis temporal (YoY, QoQ)',
            'Detección de red flags',
            'Dashboard interactivo'
        ],
        inputTypes: ['PDF', 'Excel'],
        outputTypes: ['Dashboard', 'PDF Report', 'JSON'],
        requiresIntegration: [],
        providers: ['gemini', 'vertex']
    },
    {
        id: 'bi_analyst',
        name: 'Analista de Datos IA',
        subtitle: 'Business Intelligence',
        category: 'FINANZAS',
        description: 'Conecta con Excel/sistemas, analiza datos de ventas/inventario/clientes, genera dashboards automáticos, predice tendencias, responde preguntas en lenguaje natural.',
        icon: '📊',
        color: '#dcfce7',
        cost: '$0.30',
        unit: 'análisis',
        avgTime: '45 seg',
        status: 'active', // ✅ ACTIVO
        features: [
            'Análisis descriptivo completo',
            'Forecasting ventas 3/6/12 meses',
            'Segmentación automática clientes',
            'Conversational BI (preguntas en español)',
            'Dashboards Looker Studio embebidos'
        ],
        inputTypes: ['Excel', 'CSV', 'Google Sheets', 'Database'],
        outputTypes: ['Dashboard', 'Predictions', 'JSON'],
        requiresIntegration: [],
        providers: ['vertex', 'bigquery']
    },

    // ========================================
    // INDUSTRIA 4.0 (2 agentes)
    // ========================================
    {
        id: 'vision_qa',
        name: 'Inspector IA',
        subtitle: 'Control de Calidad Visual',
        category: 'INDUSTRIA',
        description: 'Entrena modelos custom de visión computacional con imágenes del cliente, clasifica productos OK/defecto en tiempo real desde línea de producción.',
        icon: '👁️',
        color: '#fef3c7',
        cost: '$0.003',
        unit: 'imagen',
        avgTime: '0.5 seg',
        status: 'active', // ✅ ACTIVO
        features: [
            'Training custom sin expertise ML',
            'Accuracy típico 95-99%',
            'Inferencia real-time (<100ms)',
            'Multi-defecto simultáneo',
            'Integración con PLC/SCADA'
        ],
        inputTypes: ['JPG', 'PNG', 'Video Stream'],
        outputTypes: ['Classification', 'Bounding Boxes', 'Metrics'],
        requiresIntegration: [],
        providers: ['vertex', 'azure']
    },
    {
        id: 'iot_monitor',
        name: 'Monitor IoT',
        subtitle: 'Análisis de Sensores Tiempo Real',
        category: 'INDUSTRIA',
        description: 'Recibe telemetría de sensores IoT (temperatura, presión, vibración), analiza patrones, detecta anomalías automáticamente, predice fallos, genera alertas proactivas.',
        icon: '📡',
        color: '#fef3c7',
        cost: '$0.001',
        unit: 'mensaje',
        avgTime: '<1 seg',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Device management (registro/OTA updates)',
            'Ingesta MQTT/HTTP alta frecuencia',
            'Anomaly detection ML',
            'Predictive maintenance',
            'Alertas multi-canal (WhatsApp/SMS/Email)'
        ],
        inputTypes: ['MQTT', 'HTTP JSON'],
        outputTypes: ['Alerts', 'Dashboard', 'Predictions'],
        requiresIntegration: ['iot_core'],
        providers: ['vertex', 'bigquery']
    },

    // ========================================
    // CHATBOTS & ASISTENTES (2 agentes)
    // ========================================
    {
        id: 'chatbot_comercial',
        name: 'Chatbot Comercial',
        subtitle: 'Asistente de Ventas WhatsApp',
        category: 'CHATBOTS',
        description: 'Bot de ventas/soporte para atender clientes externos vía WhatsApp, usa RAG con catálogo de productos, atiende 24/7, deriva a humano cuando necesario.',
        icon: '💬',
        color: '#e0e7ff',
        cost: '$0.01',
        unit: 'conversación',
        avgTime: '2 seg',
        status: 'active', // ✅ ACTIVO
        features: [
            'RAG con catálogo productos',
            'Cotización al instante',
            'Agenda turnos/reservas',
            'Handoff inteligente a humano',
            'Lead capture automático',
            'Export a CRM (HubSpot/Salesforce)'
        ],
        inputTypes: ['Text', 'Images', 'Audio'],
        outputTypes: ['WhatsApp Messages', 'CRM Integration'],
        requiresIntegration: ['whatsapp'],
        providers: ['gemini', 'vertex']
    },
    {
        id: 'knowledge_assistant',
        name: 'Knowledge Assistant',
        subtitle: 'Asistente Técnico Interno',
        category: 'CHATBOTS',
        description: 'Bot técnico para empleados/técnicos de la empresa, responde consultas de manuales técnicos vía WhatsApp, acceso restringido, disponible 24/7 para soporte en campo.',
        icon: '📚',
        color: '#fce7f3',
        cost: '$0.02',
        unit: 'consulta',
        avgTime: '3 seg',
        status: 'active', // ✅ ACTIVO
        features: [
            'RAG avanzado multi-documento',
            'Cita fuente (manual + página exacta)',
            'Multi-modal (texto, imagen, audio)',
            'Control de acceso por roles',
            'Safety warnings automáticos',
            'Asset tracking integration'
        ],
        inputTypes: ['Text', 'Images', 'Audio', 'GPS Location'],
        outputTypes: ['WhatsApp Messages', 'Diagrams', 'Videos'],
        requiresIntegration: ['whatsapp'],
        providers: ['gemini', 'vertex']
    },

    // ========================================
    // COMPLIANCE & REGULATORIO (2 agentes)
    // ========================================
    {
        id: 'compliance',
        name: 'Compliance Assistant',
        subtitle: 'Monitor Regulatorio Argentina',
        category: 'COMPLIANCE',
        description: 'Monitorea automáticamente Boletín Oficial, resoluciones AFIP, cambios regulatorios, alerta cuando algo afecta al cliente, explica en lenguaje simple qué debe hacer.',
        icon: '🛡️',
        color: '#fee2e2',
        cost: '$0.10',
        unit: 'alerta',
        avgTime: '5 min chequeo',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Monitoreo Boletín Oficial + AFIP',
            'Filtrado inteligente por industria',
            'Resumen ejecutivo en español simple',
            'Deadline tracking + recordatorios',
            'Acciones requeridas (checklist)',
            'Historial compliance completo'
        ],
        inputTypes: ['Auto Scraping'],
        outputTypes: ['Alerts', 'Email', 'WhatsApp', 'PDF Report'],
        requiresIntegration: [],
        providers: ['gemini', 'web_scraping']
    },
    {
        id: 'doc_generator',
        name: 'Generador de Documentos',
        subtitle: 'Documentos Legales Argentina',
        category: 'COMPLIANCE',
        description: 'Genera contratos, términos y condiciones, políticas de privacidad, contratos de trabajo, documentos legales básicos adaptados a normativa argentina.',
        icon: '📝',
        color: '#fee2e2',
        cost: '$0.50',
        unit: 'documento',
        avgTime: '30 seg',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Templates argentina-compliant',
            'Wizard guiado paso a paso',
            'Validación legal automática',
            'Multi-formato (DOCX/PDF/HTML)',
            'Version control + track changes',
            'Disclaimer y recomendaciones'
        ],
        inputTypes: ['Form Data'],
        outputTypes: ['DOCX', 'PDF', 'HTML'],
        requiresIntegration: [],
        providers: ['gemini', 'claude']
    },

    // ========================================
    // OPERACIONES & PRODUCTIVIDAD (5 agentes)
    // ========================================
    {
        id: 'meeting_assistant',
        name: 'Meeting Assistant',
        subtitle: 'Transcripción & Análisis',
        category: 'OPERACIONES',
        description: 'Graba reunión (Zoom/Meet/presencial), transcribe con precisión español argentino, genera minuta profesional, extrae action items, detecta sentimiento, actualiza CRM.',
        icon: '🎙️',
        color: '#e0e7ff',
        cost: '$0.30',
        unit: 'hora',
        avgTime: '10 min',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Transcripción español argentino preciso',
            'Speaker diarization (quién dijo qué)',
            'Minuta profesional automática',
            'Action items + responsables',
            'Sentiment analysis',
            'Integración CRM (HubSpot/Salesforce)'
        ],
        inputTypes: ['Audio', 'Video (MP3/MP4/M4A)'],
        outputTypes: ['Transcription', 'Minuta DOCX/PDF', 'CRM Tasks'],
        requiresIntegration: ['crm'],
        providers: ['vertex', 'gemini']
    },
    {
        id: 'due_diligence',
        name: 'Due Diligence IA',
        subtitle: 'Verificador de Terceros',
        category: 'OPERACIONES',
        description: 'Antes de hacer negocios con nuevo proveedor/cliente, verifica automáticamente CUIT en AFIP, busca en Boletín Oficial juicios/quiebras, chequea reputación online.',
        icon: '🔍',
        color: '#ffedd5',
        cost: '$0.20',
        unit: 'verificación',
        avgTime: '45 seg',
        status: 'active', // ✅ ACTIVO
        features: [
            'Verificación AFIP completa',
            'Búsqueda Boletín Oficial',
            'Registro de morosos (Veraz/Nosis)',
            'Reputación online (Google/redes)',
            'Scoring de riesgo (1-10)',
            'Reporte PDF profesional'
        ],
        inputTypes: ['CUIT', 'Razón Social'],
        outputTypes: ['PDF Report', 'Risk Score', 'JSON'],
        requiresIntegration: ['afip'],
        providers: ['gemini', 'web_scraping']
    },
    {
        id: 'cotizador',
        name: 'Cotizador Inteligente',
        subtitle: 'Generador de Presupuestos',
        category: 'OPERACIONES',
        description: 'Cliente describe proyecto por texto/voz, IA calcula materiales necesarios, mano de obra, equipos, genera cotización profesional automáticamente.',
        icon: '💵',
        color: '#dcfce7',
        cost: '$0.15',
        unit: 'cotización',
        avgTime: '20 seg',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'NLU de requerimientos del proyecto',
            'Cálculo automático materiales + mano de obra',
            'Base de precios actualizada semanalmente',
            'Ajuste inflación automático (Argentina)',
            'PDF profesional con logo',
            '3 variantes (económica/standard/premium)'
        ],
        inputTypes: ['Text', 'Audio'],
        outputTypes: ['PDF', 'Email'],
        requiresIntegration: [],
        providers: ['gemini']
    },
    {
        id: 'cobranzas',
        name: 'Gestor de Cobranzas',
        subtitle: 'Automatización de Cobranza',
        category: 'OPERACIONES',
        description: 'Detecta facturas vencidas, envía recordatorios escalonados automáticos por WhatsApp/email, parsea respuestas del cliente, escala a humano si necesario.',
        icon: '💳',
        color: '#fce7f3',
        cost: '$0.05',
        unit: 'recordatorio',
        avgTime: '5 seg',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Detección automática facturas vencidas',
            'Mensajes escalonados (días 0/7/15/30)',
            'NLU de respuestas del cliente',
            'Multi-canal (WhatsApp/Email/SMS)',
            'Tracking completo + analytics',
            'A/B testing de mensajes'
        ],
        inputTypes: ['Database Facturas'],
        outputTypes: ['WhatsApp/Email/SMS', 'Tracking Dashboard'],
        requiresIntegration: ['whatsapp', 'erp'],
        providers: ['gemini']
    },
    {
        id: 'traductor',
        name: 'Traductor Técnico',
        subtitle: 'Especializado en Industria',
        category: 'OPERACIONES',
        description: 'Traduce manuales técnicos, documentación, manteniendo terminología correcta, contexto industrial, convierte unidades, preserva layout.',
        icon: '🌐',
        color: '#ffedd5',
        cost: '$0.08',
        unit: '1000 palabras',
        avgTime: '30 seg/página',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Context-aware translation (no Google Translate)',
            'Glosario customizable por cliente',
            'Unit conversion automático (imperial ↔ métrico)',
            'Layout preservation (tablas, diagramas)',
            'Quality assurance + back-translation',
            'Translation memory (TMX)'
        ],
        inputTypes: ['PDF', 'DOCX', 'HTML'],
        outputTypes: ['PDF', 'DOCX', 'HTML'],
        requiresIntegration: [],
        providers: ['vertex', 'gemini']
    },

    // ========================================
    // MARKETING & VENTAS (1 agente)
    // ========================================
    {
        id: 'social_listening',
        name: 'Social Listening',
        subtitle: 'Monitor de Redes Sociales',
        category: 'MARKETING',
        description: 'Monitorea menciones de marca en redes sociales, analiza sentimiento, detecta crisis, responde automáticamente, trackea competencia.',
        icon: '📱',
        color: '#fae8ff',
        cost: '$0.10',
        unit: 'día',
        avgTime: 'Real-time',
        status: 'planned', // 🚧 EN DESARROLLO
        features: [
            'Monitoreo multi-plataforma (Instagram/Facebook/Twitter)',
            'Sentiment analysis en español',
            'Clasificación automática (consulta/queja/elogio)',
            'Respuestas sugeridas',
            'Crisis detection + alertas',
            'Competencia tracking'
        ],
        inputTypes: ['Social Media APIs'],
        outputTypes: ['Alerts', 'Dashboard', 'Suggested Responses'],
        requiresIntegration: ['social_media'],
        providers: ['gemini']
    }
];

// ========================================
// HELPER FUNCTIONS
// ========================================

// Obtener agentes por categoría
function getAgentsByCategory(category) {
    return AGENTS_CATALOG.filter(agent => agent.category === category);
}

// Obtener solo agentes activos
function getActiveAgents() {
    return AGENTS_CATALOG.filter(agent => agent.status === 'active');
}

// Obtener agentes en desarrollo
function getPlannedAgents() {
    return AGENTS_CATALOG.filter(agent => agent.status === 'planned');
}

// Obtener agente por ID
function getAgentById(id) {
    return AGENTS_CATALOG.find(agent => agent.id === id);
}

// Contar agentes por categoría
function countAgentsByCategory() {
    const counts = {};
    AGENTS_CATALOG.forEach(agent => {
        counts[agent.category] = (counts[agent.category] || 0) + 1;
    });
    return counts;
}

// Estadísticas generales
function getAgentStats() {
    return {
        total: AGENTS_CATALOG.length,
        active: getActiveAgents().length,
        planned: getPlannedAgents().length,
        byCategory: countAgentsByCategory()
    };
}

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.AGENTS_CATALOG = AGENTS_CATALOG;
    window.AgentsAPI = {
        getAgentsByCategory,
        getActiveAgents,
        getPlannedAgents,
        getAgentById,
        countAgentsByCategory,
        getAgentStats
    };
}

// Log en desarrollo
if (typeof window !== 'undefined' && window.APP_CONFIG?.isDevelopment()) {
    console.log('📦 Catálogo de agentes cargado:', getAgentStats());
}