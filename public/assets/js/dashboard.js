// ========================================
// DASHBOARD - Lógica Principal
// Portal Multi-Servicio IA
// ========================================

class Dashboard {
  constructor() {
    this.currentFilter = 'all';
    this.stats = {
      totalJobs: 0,
      totalCost: 0,
      filesProcessed: 0,
      activeAgents: 7
    };
    this.jobs = [];
    this.selectedAgent = null;
  }

  // ========================================
  // INITIALIZATION
  // ========================================
  
  async init() {
    console.log('🚀 Initializing Dashboard...');
    
    // Verificar que las dependencias estén cargadas
    if (!window.APP_CONFIG) {
      console.error('❌ CONFIG not loaded');
      return;
    }
    if (!window.AGENTS_CATALOG) {
      console.error('❌ AGENTS_CATALOG not loaded');
      return;
    }
    if (!window.apiClient) {
      console.error('❌ API Client not loaded');
      return;
    }

    // Check backend health
    await this.checkBackendHealth();

    // Render initial UI
    this.renderStats();
    this.renderAgents();
    this.setupEventListeners();
    this.loadJobs();

    console.log('✅ Dashboard initialized');
  }

  // ========================================
  // BACKEND CONNECTION
  // ========================================
  
  async checkBackendHealth() {
    const result = await window.apiClient.checkHealth();
    
    if (result.success) {
      this.showToast('Conectado al backend', 'success');
      console.log('✅ Backend OK:', result.data);
    } else {
      this.showToast('Backend no disponible. Usando modo offline.', 'warning');
      console.warn('⚠️ Backend offline, using fallback mode');
    }
  }

  // ========================================
  // RENDER STATS
  // ========================================
  
  async renderStats() {
    // Intentar obtener stats del backend
    const result = await window.apiClient.getUserStats();
    
    if (result.success) {
      this.stats = result.stats;
    }

    const activeCount = window.AgentsAPI.getActiveAgents().length;
    const plannedCount = window.AgentsAPI.getPlannedAgents().length;

    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Agentes Activos</span>
          <div class="stat-icon" style="background: #d1fae5; color: var(--success);">✓</div>
        </div>
        <div class="stat-value">${activeCount}</div>
        <div class="stat-subtitle">de ${activeCount + plannedCount} planificados</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">En Desarrollo</span>
          <div class="stat-icon" style="background: #fef3c7; color: var(--warning);">🚧</div>
        </div>
        <div class="stat-value">${plannedCount}</div>
        <div class="stat-subtitle">próximamente disponibles</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Jobs Este Mes</span>
          <div class="stat-icon" style="background: #dbeafe; color: var(--primary);">📊</div>
        </div>
        <div class="stat-value">${this.stats.totalJobs}</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <span class="stat-label">Costo Total</span>
          <div class="stat-icon" style="background: #e0e7ff; color: #6366f1;">💰</div>
        </div>
        <div class="stat-value">$${this.stats.totalCost.toFixed(2)}</div>
      </div>
    `;
  }

  // ========================================
  // RENDER AGENTS
  // ========================================
  
  renderAgents() {
    const showAll = window.APP_CONFIG.SHOW_ALL_AGENTS;
    let agents = window.AGENTS_CATALOG;

    // Filtrar según modo (desarrollo vs producción)
    if (!showAll) {
      agents = agents.filter(a => a.status === 'active');
    }

    // Aplicar filtro de tabs
    if (this.currentFilter !== 'all') {
      agents = agents.filter(a => a.status === this.currentFilter);
    }

    const grid = document.getElementById('agentsGrid');
    
    if (agents.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🤖</div>
          <p>No hay agentes en esta categoría</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = agents.map(agent => `
      <div class="agent-card ${agent.status === 'planned' ? 'planned' : ''}" 
           data-agent-id="${agent.id}"
           onclick="dashboard.${agent.status === 'active' ? `selectAgent('${agent.id}')` : ''}">
        
        <div class="agent-status-badge ${agent.status === 'active' ? 'status-active' : 'status-planned'}">
          ${agent.status === 'active' ? 'Activo' : 'Próximamente'}
        </div>
        
        <div class="agent-icon" style="background: ${agent.color}">
          ${agent.icon}
        </div>
        
        <div class="agent-category">${window.APP_CONFIG.CATEGORIES[agent.category]}</div>
        
        <div class="agent-name">${agent.name}</div>
        
        <div class="agent-subtitle">${agent.subtitle}</div>
        
        <div class="agent-description">${agent.description}</div>
        
        <div class="agent-footer">
          <span class="agent-cost">${agent.cost}/${agent.unit}</span>
          <button class="btn ${agent.status === 'active' ? 'btn-primary' : 'btn-secondary'}">
            ${agent.status === 'active' ? 'Usar Agente' : 'En Desarrollo'}
          </button>
        </div>
      </div>
    `).join('');
  }

  // ========================================
  // AGENT SELECTION
  // ========================================
  
  selectAgent(agentId) {
    this.selectedAgent = window.AgentsAPI.getAgentById(agentId);
    
    if (!this.selectedAgent) {
      this.showToast('Agente no encontrado', 'error');
      return;
    }

    // Mostrar modal de configuración (por ahora un alert)
    const message = `
AGENTE SELECCIONADO
${this.selectedAgent.name}

${this.selectedAgent.description}

Costo: ${this.selectedAgent.cost}/${this.selectedAgent.unit}
Tiempo promedio: ${this.selectedAgent.avgTime}

Input: ${this.selectedAgent.inputTypes.join(', ')}
Output: ${this.selectedAgent.outputTypes.join(', ')}

En producción: Se abriría un modal con configuración específica para este agente.
    `.trim();

    alert(message);
    
    console.log('Selected agent:', this.selectedAgent);
  }

  // ========================================
  // FILTER TABS
  // ========================================
  
  filterAgents(filter) {
    this.currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(tab => {
      tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Re-render agents
    this.renderAgents();
  }

  // ========================================
  // FILE UPLOAD
  // ========================================
  
  setupEventListeners() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    if (!uploadZone || !fileInput) {
      console.warn('Upload elements not found');
      return;
    }

    // Click to upload
    uploadZone.addEventListener('click', () => {
      fileInput.click();
    });

    // Drag & drop
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
      this.handleFiles(e.dataTransfer.files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
      this.handleFiles(e.target.files);
    });
  }

  async handleFiles(files) {
    if (!files || files.length === 0) return;

    console.log('Files to upload:', files);

    // Verificar que haya un agente seleccionado
    if (!this.selectedAgent) {
      this.showToast('Primero selecciona un agente IA', 'warning');
      return;
    }

    // Validar archivos
    const validFiles = [];
    const errors = [];

    for (let file of files) {
      // Validar tamaño
      if (file.size > window.APP_CONFIG.UI.MAX_FILE_SIZE) {
        errors.push(`${file.name}: Muy grande (máx 50MB)`);
        continue;
      }

      // Validar tipo
      if (!window.APP_CONFIG.UI.ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Tipo no permitido`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      this.showToast(errors.join('\n'), 'error');
    }

    if (validFiles.length === 0) return;

    // Upload files
    this.showToast(`Subiendo ${validFiles.length} archivo(s)...`, 'info');

    for (let file of validFiles) {
      await this.uploadFile(file);
    }
  }

  async uploadFile(file) {
    try {
      const result = await window.apiClient.uploadFile(
        file, 
        this.selectedAgent.id,
        { uploadedAt: new Date().toISOString() }
      );

      if (result.success) {
        this.showToast(`✓ ${file.name} subido correctamente`, 'success');
        
        // Crear job de procesamiento
        await this.createJob(result.uploadId, result.storageUrl);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      this.showToast(`Error subiendo ${file.name}`, 'error');
    }
  }

  async createJob(uploadId, fileUrl) {
    try {
      const result = await window.apiClient.createJob(
        this.selectedAgent.id,
        { uploadId },
        [fileUrl]
      );

      if (result.success) {
        this.showToast('Procesamiento iniciado', 'success');
        
        // Reload jobs
        setTimeout(() => this.loadJobs(), 1000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Create job error:', error);
      this.showToast('Error creando job', 'error');
    }
  }

  // ========================================
  // JOBS
  // ========================================
  
  async loadJobs() {
    const result = await window.apiClient.getJobs(10);
    
    if (result.success) {
      this.jobs = result.jobs;
      this.renderJobs();
    } else {
      console.warn('Could not load jobs:', result.error);
      this.renderJobs(); // Render empty state
    }
  }

  renderJobs() {
    const container = document.getElementById('jobsContainer');
    
    if (!container) {
      console.warn('Jobs container not found');
      return;
    }

    if (this.jobs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <p>No hay trabajos todavía.</p>
          <p style="font-size: 0.875rem; margin-top: 0.5rem;">Sube un archivo para comenzar.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="jobs-header">
        <h3>Trabajos Recientes</h3>
      </div>
      <div class="jobs-list">
        ${this.jobs.map(job => this.renderJobItem(job)).join('')}
      </div>
    `;
  }

  renderJobItem(job) {
    const agent = window.AgentsAPI.getAgentById(job.agentType);
    const agentName = agent ? agent.name : job.agentName || 'Desconocido';
    
    return `
      <div class="job-item">
        <div class="job-info">
          <div class="job-name">${agentName}</div>
          <div class="job-meta">
            <span>ID: ${job.id || 'N/A'}</span>
            <span>${this.formatDate(job.createdAt)}</span>
            ${job.duration ? `<span>${job.duration}ms</span>` : ''}
          </div>
        </div>
        <div class="job-status status-${job.status}">
          ${this.getStatusLabel(job.status)}
        </div>
      </div>
    `;
  }

  getStatusLabel(status) {
    const labels = {
      queued: 'En Cola',
      processing: 'Procesando',
      completed: 'Completado',
      failed: 'Fallido'
    };
    return labels[status] || status;
  }

  formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  // ========================================
  // TOAST NOTIFICATIONS
  // ========================================
  
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}

// ========================================
// INITIALIZATION
// ========================================

let dashboard;

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}

function initDashboard() {
  dashboard = new Dashboard();
  dashboard.init();
  
  // Hacer disponible globalmente para onclick handlers
  window.dashboard = dashboard;
  
  // Auto-refresh jobs cada 10 segundos si está habilitado
  if (window.APP_CONFIG?.FEATURES.ENABLE_REALTIME_UPDATES) {
    setInterval(() => {
      dashboard.loadJobs();
    }, 10000);
  }
}

// Log en desarrollo
if (window.APP_CONFIG?.isDevelopment()) {
  console.log('📱 Dashboard module loaded');
}