# 📊 Sample Data - Acme Design System

Este es un dataset ficticio para probar la DS Measurement Platform.
Representa un Design System maduro de una empresa mediana (~15 equipos, ~200 personas).

## 📁 Archivos incluidos

### 💜 components-figma-analytics.csv
Export simulado de Figma Library Analytics.
- **Columnas**: component_name, insertions, detachments, overrides, props_usage, team, file_name, health_score, deprecated, is_snowflake
- **Uso**: Importar en categoría "Components"
- **Métricas que calcula**: Component usage, Figma inserts, detachment rate, overrides, snowflakes, component health

### 💗 support-tickets.csv
Export simulado de Zendesk/Jira Service Desk.
- **Columnas**: ticket_id, created_at, type, category, priority, status, first_response_hours, resolution_hours, feedback_score, requester_team
- **Uso**: Importar en categoría "Support"
- **Métricas que calcula**: Ticket volume, first response time, resolution time, resolution rate, feedback score

### 💛 business-metrics.json
Datos de ROI y productividad por trimestre.
- **Campos**: period, roi, component_cost, time_to_market_weeks, dev_productivity_gain, designer_productivity_gain, latest_version_adoption
- **Uso**: Importar en categoría "Business"
- **Métricas que calcula**: ROI, component cost, speed to market, productivity gains

### 💚 end-user-surveys.csv
Resultados de encuestas de satisfacción.
- **Columnas**: respondent_id, date, team, role, satisfaction, nps, sus_score, usability_score, a11y_score, ui_consistency, cwv_score
- **Uso**: Importar en categoría "End-user"
- **Métricas que calcula**: Satisfaction, NPS, SUS scores, usability, accessibility, UI consistency, Core Web Vitals

### 🧡 code-platform-stats.json
Estadísticas de npm, tests y calidad de código.
- **Campos**: package, version, downloads, test_coverage, linter_warnings, bugs_open, code_quality_score, complexity_avg, css_lines, render_time_avg_ms, tokens_used
- **Uso**: Importar en categoría "Code Platform"
- **Métricas que calcula**: npm downloads, test coverage, linter warnings, bugs backlog, code quality, complexity, CSS lines

### 🩵 other-metrics.csv
Métricas variadas de adopción, docs y OKRs.
- **Columnas**: metric, period, value, target, notes
- **Uso**: Importar en categoría "Other"
- **Métricas que calcula**: Screen adoption, local libraries, percentage adoption, doc visits, contributions, OKR completion

## 🏢 Contexto del DS ficticio "Acme"

- **Empresa**: Acme Corp (ficticia)
- **Tamaño**: ~200 empleados, 15 equipos de producto
- **DS maturity**: Nivel 3 (Adopción activa, algunos gaps)
- **Stack**: React, Figma, Storybook
- **Paquetes npm**: @acme/design-system, @acme/icons, @acme/tokens

## 📈 Estado actual simulado

| Dimensión | Score | Estado |
|-----------|-------|--------|
| Components | 72% | Near Target |
| Support | 68% | Needs Work |
| Business | 78% | Near Target |
| End-user | 75% | Near Target |
| Code Platform | 65% | Needs Work |
| Other | 62% | Needs Work |
| **Overall** | **70%** | **Near Target** |

## 🎯 Áreas de mejora identificadas

1. **Reducir snowflakes**: 34 → 10 (Marketing y Legacy tienen componentes custom)
2. **Mejorar test coverage**: 68% → 90%
3. **Reducir tickets de soporte**: Mejorar documentación
4. **Aumentar adopción**: 68% → 90% (onboarding de equipos nuevos)
5. **Consolidar librerías locales**: 8 → 3
