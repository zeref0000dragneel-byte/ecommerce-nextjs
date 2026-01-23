# 🚀 Instrucciones de Configuración y Solución de Errores

## ✅ Cambios Realizados

### 1. **Schema Prisma Actualizado**
- ✅ `comparePrice` → `compareAtPrice`
- ✅ `imageUrl String?` → `images String[]` (array)
- ✅ `directUrl` agregado en datasource para Supabase

### 2. **Fuente Inter Mejorada**
- ✅ Configurada con `display: "swap"` y fallbacks
- ✅ Funciona sin conexión a internet

### 3. **Prisma Client Mejorado**
- ✅ Logs en desarrollo
- ✅ Mejor manejo de conexión
- ✅ Singleton pattern para hot-reload

### 4. **Queries Actualizadas**
- ✅ Mapeo automático de `images[0]` a `imageUrl` para compatibilidad

### 5. **Seed Actualizado**
- ✅ Usa `images` (array) con URLs de Unsplash
- ✅ Usa `compareAtPrice` correctamente

---

## 📋 PASOS PARA EJECUTAR (EN ORDEN)

### Paso 1: Instalar Dependencias

```bash
npm install
```

Esto instalará `tsx` y otras dependencias necesarias.

---

### Paso 2: Configurar Variables de Entorno

Asegúrate de tener un archivo `.env` en la raíz del proyecto con:

```env
# DATABASE_URL: URL con connection pooling (para la app)
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1"

# DIRECT_URL: URL directa (para migraciones y seed)
DIRECT_URL="postgresql://postgres:[TU-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:5432/postgres"
```

**⚠️ IMPORTANTE:**
- Reemplaza `[TU-PASSWORD]` con tu contraseña real de Supabase
- Puedes obtener ambas URLs desde: **Supabase Dashboard > Settings > Database > Connection String**
- `DATABASE_URL` debe incluir `?pgbouncer=true&connection_limit=1`
- `DIRECT_URL` NO debe incluir `pgbouncer`

---

### Paso 3: Generar Cliente de Prisma

```bash
npm run prisma:generate
```

O simplemente:
```bash
npx prisma generate
```

---

### Paso 4: Sincronizar Base de Datos

**Opción A: Si ya tienes migraciones (recomendado)**
```bash
npm run prisma:migrate:deploy
```

**Opción B: Si necesitas crear nuevas migraciones**
```bash
npm run prisma:migrate
```

**Opción C: Si quieres hacer push directo (solo desarrollo)**
```bash
npm run prisma:push
```

---

### Paso 5: Poblar Base de Datos con Datos de Prueba

```bash
npm run prisma:seed
```

Esto creará:
- 4 categorías (Electrónica, Belleza, Hogar, Tecnología)
- 7 productos con imágenes de Unsplash
- Todos usando el formato correcto (`images` array, `compareAtPrice`)

---

### Paso 6: Limpiar Caché y Reiniciar Servidor

**En Windows (PowerShell):**
```powershell
# Detener el servidor si está corriendo (Ctrl+C)

# Limpiar caché de Next.js
Remove-Item -Recurse -Force .next

# Reiniciar servidor
npm run dev
```

**En Linux/Mac:**
```bash
# Detener el servidor si está corriendo (Ctrl+C)

# Limpiar caché de Next.js
rm -rf .next

# Reiniciar servidor
npm run dev
```

---

## 🔧 Scripts Disponibles

Después de la configuración, puedes usar estos comandos:

```bash
# Desarrollo
npm run dev

# Generar cliente Prisma
npm run prisma:generate

# Sincronizar base de datos (push directo)
npm run prisma:push

# Crear migración
npm run prisma:migrate

# Aplicar migraciones (producción)
npm run prisma:migrate:deploy

# Poblar base de datos
npm run prisma:seed

# Abrir Prisma Studio (interfaz visual)
npm run prisma:studio

# Resetear base de datos y poblar
npm run db:reset
```

---

## 🐛 Solución de Problemas

### Error: "Can't reach database server"

**Causa:** La URL de conexión es incorrecta o la base de datos no está accesible.

**Solución:**
1. Verifica que `DATABASE_URL` y `DIRECT_URL` estén correctos en `.env`
2. Verifica que tu proyecto de Supabase esté activo
3. Verifica que la contraseña sea correcta
4. Prueba la conexión desde Supabase Dashboard > Settings > Database

### Error: "Failed to download Inter from Google Fonts"

**Causa:** Problema de conexión a internet o configuración de Next.js.

**Solución:**
- Ya está solucionado con fallbacks. La fuente usará `system-ui` o `arial` si no puede descargar Inter.
- Si persiste, verifica tu conexión a internet.

### Error: "Field 'imageUrl' doesn't exist"

**Causa:** El schema usa `images` (array) pero el código busca `imageUrl`.

**Solución:**
- Ya está solucionado. Las queries ahora mapean `images[0]` a `imageUrl` automáticamente.

### Error al ejecutar seed

**Causa:** `tsx` no está instalado o la base de datos no está sincronizada.

**Solución:**
```bash
# Instalar tsx
npm install -D tsx

# Sincronizar base de datos primero
npm run prisma:push

# Luego ejecutar seed
npm run prisma:seed
```

---

## ✅ Verificación Final

Después de ejecutar todos los pasos, deberías poder:

1. ✅ Ver la aplicación en `http://localhost:3000`
2. ✅ Ver productos en la página principal
3. ✅ Ver productos en `/shop`
4. ✅ No ver errores en la consola del servidor
5. ✅ Ver logs de Prisma en desarrollo: "✅ Prisma Client conectado correctamente"

---

## 📝 Notas Importantes

- **NO modifiques** los componentes de UI premium (Header, ProductCard, etc.)
- **NO cambies** la paleta de colores "Sunny Beach Day"
- El mapeo de `images[0]` a `imageUrl` es temporal para compatibilidad
- En el futuro, considera actualizar todos los componentes para usar `images` directamente

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando correctamente. Si encuentras algún problema, revisa los logs en la consola del servidor y verifica las variables de entorno.
