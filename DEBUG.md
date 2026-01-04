# Guía de Depuración

## Si no se muestra nada en el navegador

### 1. Verificar que el backend esté corriendo
```bash
cd backend
npm run dev
```
Debería mostrar: `🚀 Server running on http://localhost:3001`

### 2. Verificar que el frontend esté corriendo
```bash
cd frontend
npm run dev
```
Debería mostrar algo como: `Local: http://localhost:3000/`

### 3. Verificar errores en la consola del navegador
- Abre las herramientas de desarrollador (F12 o Cmd+Option+I)
- Ve a la pestaña "Console"
- ¿Hay errores en rojo?

### 4. Verificar la pestaña Network
- En las herramientas de desarrollador, ve a "Network"
- Recarga la página (F5)
- Busca la petición a `/api/dashboard`
- ¿Qué código de estado tiene? (200, 404, 500, etc.)
- ¿Qué respuesta devuelve?

### 5. Verificar en la terminal del backend
- ¿Aparecen errores en la consola?
- ¿Se está generando el archivo `data/metrics.json`?

### 6. Probar directamente la API
Abre en el navegador: `http://localhost:3001/api/dashboard`
¿Devuelve datos JSON o un error?

## Problemas comunes

### Error: "Cannot GET /api/dashboard"
- El backend no está corriendo o está en un puerto diferente
- Verifica el puerto en `backend/.env` o `backend/src/index.ts`

### Error: "Network Error" o CORS
- El backend no está permitiendo CORS
- Verifica que `cors()` esté configurado en `backend/src/index.ts`

### Página en blanco sin errores
- Revisa la consola del navegador
- Verifica que React esté montado correctamente
- Abre las herramientas de desarrollador y ve a "Elements" para ver si hay HTML

### Solo muestra "Cargando datos..."
- El backend no está respondiendo
- Hay un error en la petición a la API
- Revisa la consola del navegador y la terminal del backend

