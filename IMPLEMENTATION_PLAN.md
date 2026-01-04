# Plan de Implementación - Arquitectura Completa

## Fase 1: Controles Globales (Top Bar)
1. ✅ Selector de Productos (All + lista)
2. ✅ Selector de Período (Q1/Q2/30d/90d/custom)
3. ✅ Fuente de datos + última actualización
4. ✅ Botón "Run analysis"
5. ✅ Acciones rápidas (Export CSV, Upload file)

## Fase 2: Dashboard Mejorado
1. ✅ ROI Hero (ya existe, mejorar deep link)
2. ✅ Visual Summary Grid (Chart Cards clicables)
   - Adopción DS (donut/radial)
   - Reutilización de Componentes (stacked bar)
   - Tiempo Ahorrado (bar compare With DS vs Baseline)
   - Desviaciones (counter + sparkline)
   - Accesibilidad (gauge + #issues) - NUEVO
   - Consistencia diseño-código (opcional)
3. ✅ Insights mejorados
4. ✅ Deep linking desde cards

## Fase 3: Métricas de Producto
1. ✅ Añadir Accesibilidad score
2. ✅ Cards clicables a páginas de detalle
3. ✅ Páginas de detalle:
   - /metrics/product/adoption
   - /metrics/product/detachments
   - /metrics/product/consistency
   - /metrics/product/accessibility
4. ✅ Tabla de componentes con drill-down
5. ✅ Export CSV

## Fase 4: Desarrollo
1. ✅ Páginas de detalle:
   - /metrics/dev/usage
   - /metrics/dev/ui-bugs
   - /metrics/dev/implementation-time
   - /metrics/dev/bundle-impact
2. ✅ Repositorio detail page
3. ✅ Actividad reciente con links

## Fase 5: KPIs y OKRs
1. ✅ KPI Detail pages
2. ✅ OKR Detail pages
3. ✅ Mejorar visualización

## Fase 6: ROI
1. ✅ Comparativa With DS vs Baseline
2. ✅ Escenarios (conservador/realista/optimista)
3. ✅ Breakdown mejorado

## Fase 7: Component Detail
1. ✅ /components/:componentName
2. ✅ Usage, detach rate, products, deviations
3. ✅ Links a Figma, Code, Issues

## Fase 8: Multiproducto
1. ✅ Filtros por producto en todas las páginas
2. ✅ Vistas: Aggregate vs Split by product
3. ✅ Deep links con ?product=param
4. ✅ Columna "Product" en tablas

## Fase 9: Data Sources
1. ✅ Página /data-sources
2. ✅ Conectar Figma/GitHub/Jira
3. ✅ Templates CSV
4. ✅ Historial de uploads
5. ✅ Health monitoring

## Prioridad de Implementación

### Alta Prioridad (MVP):
- Fase 1: Controles Globales
- Fase 2: Dashboard mejorado (solo cards clicables básicos)
- Accesibilidad como métrica
- Export CSV básico

### Media Prioridad:
- Páginas de detalle principales
- Comparativa Baseline
- Component detail pages

### Baja Prioridad (Nice to have):
- Data Sources page completa
- Multiproducto avanzado
- Escenarios ROI
