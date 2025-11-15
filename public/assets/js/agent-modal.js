// ========================================
// AGENT CONFIGURATION MODAL
// ========================================

class AgentModal {
  constructor() {
    this.agent = null;
    this.selectedFiles = [];
    this.overlay = null;
  }

  // Abrir modal con agente específico
  open(agentId) {
    this.agent = window.AgentsAPI.getAgentById(agentId);
    
    if (!this.agent) {
      console.error('Agent not found:', agentId);
      return;
    }

    this.render();
    this.attachEventListeners();
  }

  // Renderizar modal
  render() {
    // Crear overlay si no existe
    if (this.overlay) {
      this.overlay.remove();
    }

    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.innerHTML = `
      <div class="modal" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-header-content">
            <div class="modal-icon" style="background: ${this.agent.color}">
              ${this.agent.icon}
            </div>
            <h2 class="modal-title">${this.agent.name}</h2>
            <p class="modal-subtitle">${this.agent.subtitle}</p>
          </div>
          <button class="modal-close" onclick="agentModal.close()">×</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Description -->
          <div class="modal-section">
            <h3 class="modal-section-title">Descripción</h3>
            <p class="modal-description">${this.agent.description}</p>
          </div>

          <!-- Info Grid -->
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Costo</div>
              <div class="info-value">${this.agent.cost}/${this.agent.unit}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Tiempo Promedio</div>
              <div class="info-value">${this.agent.avgTime}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Input</div>
              <div class="info-value" style="font-size: 0.875rem;">${this.agent.inputTypes.join(', ')}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Output</div>
              <div class="info-value" style="font-size: 0.875rem;">${this.agent.outputTypes.join(', ')}</div>
            </div>
          </div>

          <!-- Features -->
          ${this.agent.features && this.agent.features.length > 0 ? `
            <div class="modal-section">
              <h3 class="modal-section-title">Características</h3>
              <ul class="features-list">
                ${this.agent.features.map(f => `<li>${f}</li>`).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- File Upload -->
          <div class="modal-section">
            <h3 class="modal-section-title">Archivos a Procesar</h3>
            <div class="file-input-wrapper">
              <div class="file-input-custom" id="modalFileInput">
                <div class="file-input-content">
                  <div class="file-input-icon">📁</div>
                  <div class="file-input-text">Click para seleccionar archivos</div>
                  <div class="file-input-subtext">Tipos permitidos: ${this.agent.inputTypes.join(', ')}</div>
                </div>
              </div>
              <input type="file" id="agentFileInput" style="display: none;" multiple 
                     accept="${this.getAcceptString()}">
            </div>
            <div id="selectedFilesList" class="selected-files"></div>
          </div>

          <!-- Additional Options (si aplica) -->
          ${this.renderAdditionalOptions()}

          <!-- Cost Estimate -->
          <div class="cost-estimate">
            <div class="cost-estimate-label">Costo Estimado</div>
            <div class="cost-estimate-value" id="costEstimate">$0.00</div>
            <div class="cost-estimate-breakdown" id="costBreakdown">
              Selecciona archivos para calcular
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn-outline" onclick="agentModal.close()">Cancelar</button>
          <button class="btn btn-primary" id="processBtn" disabled>
            Procesar Archivos
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);

    // Click fuera del modal para cerrar
    this.overlay.addEventListener('click', () => this.close());
  }

  // Opciones adicionales según el agente
  renderAdditionalOptions() {
    // Aquí se pueden agregar opciones específicas por agente
    // Por ahora retornamos vacío, pero es extensible

    if (this.agent.id === 'facturas_afip') {
      return `
        <div class="modal-section">
          <h3 class="modal-section-title">Opciones de Exportación</h3>
          <div class="form-group">
            <label class="form-label">Formato de salida</label>
            <select class="form-select" id="outputFormat">
              <option value="excel">Excel (.xlsx)</option>
              <option value="json">JSON</option>
              <option value="tango">Exportar a Tango Gestión</option>
            </select>
          </div>
        </div>
      `;
    }

    return '';
  }

  // Generar string de accept para input file
  getAcceptString() {
    const typeMap = {
      'PDF': '.pdf',
      'JPG': '.jpg,.jpeg',
      'PNG': '.png',
      'XLSX': '.xlsx,.xls',
      'Excel': '.xlsx,.xls',
      'CSV': '.csv',
      'DOCX': '.docx,.doc',
      'Audio': '.mp3,.m4a,.wav',
      'Video': '.mp4,.avi,.mov'
    };

    return this.agent.inputTypes
      .map(type => typeMap[type] || '')
      .filter(Boolean)
      .join(',');
  }

  // Event listeners
  attachEventListeners() {
    // File input click
    const fileInputCustom = document.getElementById('modalFileInput');
    const fileInput = document.getElementById('agentFileInput');
    
    if (fileInputCustom && fileInput) {
      fileInputCustom.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    // Process button
    const processBtn = document.getElementById('processBtn');
    if (processBtn) {
      processBtn.addEventListener('click', () => this.processFiles());
    }
  }

  // Manejar selección de archivos
  handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    // Validar archivos
    const validFiles = [];
    const errors = [];

    files.forEach(file => {
      // Validar tamaño (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        errors.push(`${file.name}: Muy grande (máx 50MB)`);
        return;
      }

      // Validar tipo
      const ext = file.name.split('.').pop().toLowerCase();
      const acceptedExts = this.getAcceptString().split(',').map(e => e.replace('.', ''));
      
      if (!acceptedExts.includes(ext)) {
        errors.push(`${file.name}: Tipo no permitido`);
        return;
      }

      validFiles.push(file);
    });

    // Mostrar errores si hay
    if (errors.length > 0) {
      alert('Errores de validación:\n\n' + errors.join('\n'));
    }

    // Agregar archivos válidos
    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    this.renderSelectedFiles();
    this.updateCostEstimate();
  }

  // Renderizar archivos seleccionados
  renderSelectedFiles() {
    const container = document.getElementById('selectedFilesList');
    const fileInputCustom = document.getElementById('modalFileInput');
    const processBtn = document.getElementById('processBtn');

    if (!container) return;

    if (this.selectedFiles.length === 0) {
      container.innerHTML = '';
      fileInputCustom.classList.remove('has-file');
      processBtn.disabled = true;
      return;
    }

    fileInputCustom.classList.add('has-file');
    processBtn.disabled = false;

    container.innerHTML = this.selectedFiles.map((file, index) => `
      <div class="selected-file">
        <span class="selected-file-name">${file.name}</span>
        <span class="remove-file" onclick="agentModal.removeFile(${index})">×</span>
      </div>
    `).join('');
  }

  // Remover archivo
  removeFile(index) {
    this.selectedFiles.splice(index, 1);
    this.renderSelectedFiles();
    this.updateCostEstimate();
  }

  // Actualizar estimación de costo
  updateCostEstimate() {
    const costValue = document.getElementById('costEstimate');
    const costBreakdown = document.getElementById('costBreakdown');

    if (!costValue || !costBreakdown) return;

    const count = this.selectedFiles.length;
    
    if (count === 0) {
      costValue.textContent = '$0.00';
      costBreakdown.textContent = 'Selecciona archivos para calcular';
      return;
    }

    // Calcular costo
    const unitCost = parseFloat(this.agent.cost.replace('$', ''));
    const totalCost = (unitCost * count).toFixed(2);

    costValue.textContent = `$${totalCost}`;
    costBreakdown.textContent = `${count} ${this.agent.unit}${count > 1 ? 's' : ''} × $${unitCost.toFixed(2)}`;
  }

  // Procesar archivos
  async processFiles() {
    if (this.selectedFiles.length === 0) {
      alert('Selecciona al menos un archivo');
      return;
    }

    const processBtn = document.getElementById('processBtn');
    processBtn.disabled = true;
    processBtn.textContent = 'Procesando...';

    try {
      // Upload cada archivo
      const uploadPromises = this.selectedFiles.map(file => 
        window.apiClient.uploadFile(file, this.agent.id, {
          uploadedAt: new Date().toISOString()
        })
      );

      const results = await Promise.all(uploadPromises);
      
      // Verificar éxitos
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        alert(`${failed.length} archivo(s) fallaron al subir`);
      }

      if (successful.length > 0) {
        // Crear jobs para archivos subidos exitosamente
        for (let result of successful) {
          await window.apiClient.createJob(
            this.agent.id,
            { uploadId: result.uploadId },
            [result.storageUrl]
          );
        }

        // Mostrar éxito
        if (window.dashboard) {
          window.dashboard.showToast(
            `✓ ${successful.length} archivo(s) en procesamiento`,
            'success'
          );
          
          // Recargar jobs
          setTimeout(() => window.dashboard.loadJobs(), 1000);
        }

        // Cerrar modal
        this.close();
      }

    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error procesando archivos: ' + error.message);
      processBtn.disabled = false;
      processBtn.textContent = 'Procesar Archivos';
    }
  }

  // Cerrar modal
  close() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    this.selectedFiles = [];
    this.agent = null;
  }
}

// Instancia global
const agentModal = new AgentModal();

// Hacer disponible globalmente
if (typeof window !== 'undefined') {
  window.agentModal = agentModal;
}