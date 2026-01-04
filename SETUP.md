# Instrucciones de Instalación

## Pasos para ejecutar la aplicación

1. **Instalar dependencias del frontend:**
```bash
cd frontend
npm install
```

2. **Verificar que react-router-dom se instaló:**
```bash
npm list react-router-dom
```

3. **Iniciar el servidor de desarrollo:**
```bash
# Desde la raíz del proyecto
npm run dev

# O desde frontend/
npm run dev
```

4. **Verificar errores en la consola:**
   - Abre el navegador en http://localhost:3000
   - Abre las herramientas de desarrollador (F12)
   - Revisa la consola por errores

## Si ves errores:

### Error: "Cannot find module 'react-router-dom'"
**Solución:** Ejecuta `npm install` en el directorio `frontend/`

### Error: "Module not found" para componentes
**Solución:** Verifica que todos los archivos estén en las rutas correctas:
- `src/pages/Dashboard.tsx`
- `src/components/dashboard/ROIGlobalCard.tsx`
- `src/components/dashboard/KPIOverview.tsx`
- `src/components/dashboard/SectionCards.tsx`

### La página está en blanco
**Solución:** 
1. Verifica la consola del navegador
2. Verifica que el backend esté corriendo en puerto 3001
3. Verifica que no haya errores de compilación en la terminal

