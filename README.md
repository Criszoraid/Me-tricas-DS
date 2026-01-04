# Métricas DS - Design System Analytics Platform

Plataforma interna de análisis para Design Systems que calcula y visualiza el valor total usando métricas de diseño (Figma), desarrollo (GitHub), KPIs, OKRs y ROI.

## Arquitectura

- **Frontend**: React + TypeScript + Vite + Chart.js
- **Backend**: Node.js + TypeScript + Express
- **Storage**: JSON files (MVP, in-memory)

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar backend y frontend en paralelo
npm run dev

# Solo backend (puerto 3001)
npm run dev:backend

# Solo frontend (puerto 3000)
npm run dev:frontend
```

## Variables de Entorno

Crear `.env` en el directorio `backend/`:

```env
FIGMA_ACCESS_TOKEN=tu_token_de_figma
GITHUB_TOKEN=tu_token_de_github
PORT=3001
```

### Obtener Tokens

- **Figma**: https://www.figma.com/developers/api#access-tokens
- **GitHub**: https://github.com/settings/tokens (necesitas permisos `repo`)

## Estructura

```
.
├── backend/          # API REST
│   ├── src/
│   │   ├── models/   # Modelos de datos (Types, Metrics, KPIs, OKRs, ROI)
│   │   ├── services/ # Servicios (Figma, GitHub)
│   │   ├── utils/    # Utilidades (ROI Calculator, KPI Calculator, Storage)
│   │   └── index.ts  # Servidor Express
│   └── data/         # Archivos JSON (generados automáticamente)
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/ # Componentes React
│   │   ├── services/   # API client
│   │   ├── types/      # TypeScript types
│   │   └── App.tsx
├── examples/         # Archivos de ejemplo y templates
└── README.md
```

## API Endpoints

### Métricas
- `POST /api/analyze/figma` - Analizar archivos de Figma
- `POST /api/analyze/github` - Analizar repositorios de GitHub
- `POST /api/metrics/manual` - Agregar métricas manualmente

### Dashboard
- `GET /api/dashboard` - Obtener todos los datos del dashboard

### ROI
- `GET /api/roi` - Obtener ROI actual
- `POST /api/roi` - Calcular y guardar ROI

### KPIs
- `GET /api/kpis` - Obtener todos los KPIs

### OKRs
- `GET /api/okrs` - Obtener todos los OKRs
- `POST /api/okrs` - Crear nuevo OKR
- `PUT /api/okrs/:id` - Actualizar OKR

## Características

- ✅ Análisis automático de Figma (componentes, adopción)
- ✅ Análisis automático de GitHub (uso del DS, issues)
- ✅ Métricas manuales editables
- ✅ Cálculo de ROI con niveles de confianza
- ✅ KPIs derivados de métricas con umbrales configurables
- ✅ Gestión de OKRs
- ✅ Dashboard con visualizaciones usando Chart.js
- ✅ UI profesional y minimalista
- ✅ Datos de ejemplo precargados para demostración

## Archivos de Ejemplo

La carpeta `examples/` contiene archivos JSON de ejemplo que puedes usar como referencia o templates:
- `design-metrics-example.json` - Ejemplo de métricas de diseño
- `development-metrics-example.json` - Ejemplo de métricas de desarrollo
- `roi-example.json` - Ejemplo de cálculo de ROI
- `okr-example.json` - Ejemplo de OKR
- `complete-sample.json` - Dataset completo de ejemplo
- `manual-metrics-template.json` - Template para datos manuales

Consulta `examples/README.md` para más detalles sobre cómo usarlos.
