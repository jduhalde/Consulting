# 🤖 Portal Multi-Servicio IA - Julio Duhalde Consulting

> Plataforma enterprise de servicios de Inteligencia Artificial para PYMEs argentinas

[![Firebase](https://img.shields.io/badge/Firebase-Cloud%20Functions-orange)](https://firebase.google.com)
[![Multi-Cloud](https://img.shields.io/badge/Multi--Cloud-Vertex%20AI%20%7C%20Azure%20%7C%20AWS-blue)](https://cloud.google.com)
[![Status](https://img.shields.io/badge/Status-Development-yellow)](https://github.com/jduhalde/Consulting)

---

## 📋 Descripción

Portal profesional que ofrece **16 agentes de IA especializados** en 6 verticales de negocio:

- 💰 **Finanzas & Contabilidad** (4 agentes)
- 🏭 **Industria 4.0** (2 agentes)
- 💬 **Chatbots & Asistentes** (2 agentes)
- 🛡️ **Compliance & Regulatorio** (2 agentes)
- ⚡ **Operaciones & Productividad** (5 agentes)
- 📈 **Marketing & Ventas** (1 agente)

---

## 🎯 Estado Actual del Proyecto

### ✅ Completado
- [x] Backend base con Cloud Functions
- [x] 7 agentes catalogados en Firestore
- [x] Estructura de datos completa
- [x] Endpoints API testeados localmente
- [x] Security Rules diseñadas
- [x] Multi-cloud orchestration (arquitectura)

### 🚧 En Desarrollo
- [ ] Frontend profesional (Client Portal)
- [ ] Admin Panel
- [ ] 9 agentes adicionales
- [ ] Integraciones externas (AFIP, Tango, WhatsApp)
- [ ] Deploy a producción

### 📅 Próximos Pasos
1. Frontend completo funcionando con backend local
2. Desarrollo agentes prioritarios (Facturas AFIP, Chatbot, Vision QA)
3. Testing exhaustivo local
4. Deploy a Firebase Production (Blaze Plan)

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
FRONTEND:  HTML5/CSS3/JavaScript (Vanilla)
BACKEND:   Firebase Cloud Functions (Node.js 18+)
DATABASE:  Firestore + BigQuery
STORAGE:   Firebase Storage (GCS)
AUTH:      Firebase Authentication
AI:        Multi-Cloud (Vertex AI, Azure OpenAI, AWS Bedrock)
```

### Estructura del Proyecto

```
jd-consultora-ai-portal/
├── functions/              # Backend - Cloud Functions
│   ├── index.js           # Entry point
│   ├── agentRegistry.js   # Catálogo de agentes
│   ├── orchestrator.js    # Multi-cloud routing
│   └── ...
├── public/                # Frontend estático
│   ├── index.html         # Landing page
│   ├── dashboard.html     # Client portal
│   └── admin.html         # Admin panel
├── firestore.rules        # Security rules
├── storage.rules          # Storage security
├── firebase.json          # Firebase config
├── .env.example           # Template variables entorno
└── README.md
```

---

## 🚀 Instalación y Setup

### Prerrequisitos

- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)
- Cuenta Firebase/GCP
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/jduhalde/Consulting.git
cd Consulting
```

### 2. Instalar Dependencias

```bash
cd functions
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar template
cp .env.example .env

# Editar .env con tus credenciales
nano .env
```

**IMPORTANTE:** Nunca subir `.env` a GitHub. Está en `.gitignore`.

### 4. Inicializar Firebase

```bash
firebase login
firebase init
```

Seleccionar:
- Functions
- Firestore
- Storage
- Hosting

### 5. Deploy Local (Emulators)

```bash
firebase emulators:start
```

Acceder a:
- Functions: http://localhost:5001
- Firestore: http://localhost:8080
- UI Emulators: http://localhost:4000

---

## 🧪 Testing

### Endpoints Disponibles

```bash
# Health Check
GET http://localhost:5001/your-project/us-central1/api/health

# Listar Agentes
GET http://localhost:5001/your-project/us-central1/api/agents

# Procesar Factura AFIP (ejemplo)
POST http://localhost:5001/your-project/us-central1/api/agents/facturas_afip/process
Content-Type: application/json
{
  "fileUrl": "gs://bucket/factura.pdf"
}
```

### Testear con Postman/Thunder Client

Importar colección de endpoints desde `/docs/api-collection.json` (próximamente)

---

## 📦 Deploy a Producción

### 1. Habilitar Blaze Plan

```bash
firebase projects:list
firebase use --add production-project-id
```

### 2. Configurar Secrets

```bash
# Ejemplo: AFIP Certificate
firebase functions:secrets:set AFIP_CERT < path/to/cert.pfx
```

### 3. Deploy Functions

```bash
firebase deploy --only functions
```

### 4. Deploy Hosting + Rules

```bash
firebase deploy --only hosting,firestore,storage
```

---

## 🔐 Seguridad

### Variables de Entorno

**NUNCA subir a Git:**
- Certificados AFIP (`.pfx`)
- API Keys (Azure, AWS, WhatsApp)
- Service Account Keys (`.json`)
- Passwords

Usar **Google Secret Manager** para producción.

### Firestore Security Rules

Las reglas implementan:
- Autenticación obligatoria
- Autorización por roles (admin, client_demo, client_pro)
- Rate limiting por tier
- Aislamiento de datos por usuario

Ver: `firestore.rules`

---

## 🤖 Catálogo de Agentes

### Agentes Activos (7)

1. **Contador IA - Facturas AFIP** - Procesa facturas argentinas, valida AFIP, exporta Excel
2. **Auditor IA - Contratos Legales** - Analiza contratos, detecta riesgos, genera reportes
3. **Inspector IA - Control de Calidad** - Vision AI para detección de defectos
4. **Chatbot Comercial WhatsApp** - Asistente de ventas 24/7
5. **Knowledge Assistant WhatsApp** - Soporte técnico para empleados
6. **Due Diligence IA** - Verificación automática de terceros (AFIP + Boletín Oficial)
7. **Analista de Datos IA** - Business Intelligence conversacional

### Agentes Planificados (9)

- Analista Balances Financieros
- Monitor IoT Tiempo Real
- Compliance Assistant Argentina
- Generador Documentos Legales
- Meeting Assistant (transcripción + análisis)
- Cotizador Inteligente
- Gestor de Cobranzas Automático
- Traductor Técnico Especializado
- Social Listening Monitor

---

## 📊 Monitoreo y Observabilidad

### Cloud Monitoring
- Uptime checks
- Error rates
- Latency por función
- Cost tracking

### Cloud Logging
- Logs estructurados (JSON)
- Trazabilidad completa
- Retención 30 días

### Alertas
- Error rate > 5%
- AI provider down
- Cost spike > 20%
- Storage quota > 80%

Ver configuración en `/monitoring/alerts.yaml` (próximamente)

---

## 💰 Costos Estimados

### Por Agente (aproximado)

| Agente | Costo por Ejecución |
|--------|---------------------|
| Facturas AFIP | $0.50 USD |
| Contratos Legales | $1.20 USD |
| Vision QA | $0.003 USD/imagen |
| Chatbot WhatsApp | $0.01 USD/conversación |
| Meeting Assistant | $0.30 USD/hora |

### Infraestructura Base (Blaze Plan)

- Cloud Functions: ~$10-50/mes
- Firestore: ~$5-20/mes
- Storage: ~$2-10/mes
- BigQuery: ~$5-15/mes

**Total estimado:** $25-100/mes (depende del volumen)

---

## 🌐 Integraciones Disponibles

### Gobierno Argentina
- ✅ AFIP (validación CUIT, facturas electrónicas)
- ⏳ Rentas Provinciales
- ⏳ Boletín Oficial

### ERPs
- ⏳ Tango Gestión
- ⏳ Bejerman
- ⏳ Odoo
- ⏳ SAP Business One

### Comunicación
- ✅ WhatsApp Business API
- ⏳ Twilio (SMS/Voice)
- ⏳ SendGrid (Email)

### Pagos
- ⏳ Mercado Pago
- ⏳ Todo Pago
- ⏳ Stripe

---

## 📚 Documentación Adicional

- [Arquitectura Completa](docs/architecture.md)
- [Guía de Contribución](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Roadmap](docs/roadmap.md)

---

## 🤝 Contribución

Este es un proyecto privado para **Julio Duhalde Consulting**.

Para reportar issues o sugerencias: [GitHub Issues](https://github.com/jduhalde/Consulting/issues)

---

## 📄 Licencia

Propietario: **Julio Duhalde Consulting**  
Todos los derechos reservados © 2024

---

## 📞 Contacto

**Julio Duhalde**  
Email: [contacto@julioduhalde.com](mailto:contacto@julioduhalde.com)  
LinkedIn: [Julio Duhalde](https://linkedin.com/in/julioduhalde)  
Web: [www.julioduhalde.com](https://www.julioduhalde.com)

---

## 🎯 Roadmap 2024-2025

- [x] Q4 2024: Backend base + 7 agentes
- [ ] Q1 2025: Frontend completo + 16 agentes
- [ ] Q2 2025: Primeros 10 clientes beta
- [ ] Q3 2025: Lanzamiento comercial
- [ ] Q4 2025: 100+ clientes activos

---

**Versión:** 0.5.0 (Development)  
**Última actualización:** Noviembre 2025