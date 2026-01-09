# 🚀 Despliegue en GitHub Pages

Este documento explica cómo desplegar el Dashboard de Métricas DS en GitHub Pages.

## 📋 Requisitos Previos

- Repositorio en GitHub
- GitHub Actions habilitado
- Permisos de escritura en el repositorio

## 🔧 Configuración

### 1. Habilitar GitHub Pages

1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
2. En **Source**, selecciona **GitHub Actions**
3. Guarda los cambios

### 2. El Workflow ya está configurado

El archivo `.github/workflows/deploy.yml` ya está configurado para:
- Construir el frontend automáticamente cuando hagas push a `main`
- Desplegar en GitHub Pages
- Usar datos mock cuando el backend no esté disponible

### 3. Hacer el primer despliegue

```bash
# Asegúrate de estar en la rama main
git checkout main

# Añade los cambios
git add .
git commit -m "Configurar GitHub Pages"

# Sube los cambios
git push origin main
```

### 4. Verificar el despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás un workflow ejecutándose llamado "Deploy to GitHub Pages"
3. Cuando termine, ve a **Settings** → **Pages**
4. Verás la URL de tu sitio: `https://Criszoraid.github.io/Me-tricas-DS/`

## 🌐 URL del Dashboard

Una vez desplegado, tu dashboard estará disponible en:
```
https://Criszoraid.github.io/Me-tricas-DS/
```

## 📝 Notas Importantes

### Modo GitHub Pages (sin backend)

- El dashboard funciona con **datos mock** cuando se detecta que está en GitHub Pages
- Las funciones de edición manual y carga de archivos no funcionarán (requieren backend)
- El dashboard es completamente funcional para visualización y exportación

### Desarrollo Local

Para desarrollo local con backend:

```bash
# Instalar dependencias
npm install

# Ejecutar backend y frontend
npm run dev
```

El frontend estará en `http://localhost:3000` y el backend en `http://localhost:3001`.

### Cambios en el Código

- **HashRouter**: Se usa `HashRouter` en lugar de `BrowserRouter` para compatibilidad con GitHub Pages
- **Base Path**: Configurado en `vite.config.ts` para usar `/Me-tricas-DS/` en producción
- **Datos Mock**: El API detecta automáticamente si está en GitHub Pages y usa datos mock

## 🔄 Actualizaciones Automáticas

Cada vez que hagas push a la rama `main`, GitHub Actions:
1. Construirá el frontend
2. Desplegará automáticamente en GitHub Pages
3. El sitio se actualizará en unos minutos

## 🐛 Solución de Problemas

### El sitio no se actualiza
- Verifica que el workflow se haya ejecutado correctamente en **Actions**
- Espera 2-3 minutos después del push
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)

### Errores en el build
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs en **Actions** para ver el error específico

### Rutas no funcionan
- Asegúrate de que `HashRouter` esté configurado en `App.tsx`
- Verifica que el `base` en `vite.config.ts` sea correcto

## 📚 Más Información

- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions](https://docs.github.com/en/actions)

