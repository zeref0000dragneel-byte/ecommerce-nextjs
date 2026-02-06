# 📌 Reporte Técnico: E-commerce Next.js

**Proyecto:** E-comeerce_Local (ecommerce-nextjs)  
**Stack:** Next.js 16.1.1, TypeScript, Tailwind CSS, Prisma 5.22.0, Supabase (PostgreSQL), Cloudinary, MercadoPago (TEST)  
**URL de producción (referencia):** https://ecommerce-nextjs-b9mxc40lk-zerefs-projects-3dfc6c82.vercel.app

---

## 1. Estructura del Proyecto

Árbol de archivos críticos (sin `node_modules`, `.next`, etc.):

```
E-comeerce_Local/
├── middleware.ts                    # Protección rutas /admin
├── next.config.ts                   # Config Next.js (imágenes, headers, TypeScript)
├── next.config.js                   # Posible duplicado
├── vercel.json                      # buildCommand: prisma generate && next build
├── package.json
├── tsconfig.json                    # baseUrl ".", paths "@/*" -> "./src/*"
├── prisma/
│   ├── schema.prisma                # 7 modelos: Category, Product, ProductVariant, Customer, Order, OrderItem, OrderStatus
│   ├── seed.ts
│   └── migrations/                  # 5 migraciones (init, ecommerce_schema, mercadopago_id, product_variants, location_coordinates)
├── public/                          # Imágenes estáticas, favicon, SVGs
└── src/
    ├── app/
    │   ├── layout.tsx               # Root: CartProvider, metadata, Inter font
    │   ├── page.tsx                 # Home
    │   ├── globals.css
    │   ├── lib/
    │   │   ├── prisma.ts            # Singleton Prisma (evita múltiples instancias en dev)
    │   │   ├── auth.ts              # isAuthenticated, requireAuth, clearAdminSession (cookie admin-session)
    │   │   └── mercadopago.ts       # Cliente MP, MP_CONFIG (backUrls, notificationUrl)
    │   ├── api/
    │   │   ├── auth/login/route.ts   # POST: login admin (cookie admin-session)
    │   │   ├── auth/logout/route.ts  # POST: borrar cookie
    │   │   ├── products/route.ts    # GET, POST
    │   │   ├── products/[id]/route.ts
    │   │   ├── products/[id]/variants/route.ts
    │   │   ├── products/[id]/variants/[variantId]/route.ts
    │   │   ├── categories/route.ts, categories/[id]/route.ts
    │   │   ├── orders/route.ts      # GET (filtros), POST (crear orden - usado por flujo alternativo)
    │   │   ├── orders/[id]/route.ts # GET, PATCH (cambiar status)
    │   │   ├── orders/cleanup/route.ts
    │   │   ├── checkout/create-preference/route.ts  # Flujo actual: preferencia MP sin crear orden
    │   │   ├── mercadopago/create-preference/route.ts  # Flujo por orderId (orden ya creada)
    │   │   ├── webhooks/mercadopago/route.ts  # Crea orden + descuenta stock al aprobar pago
    │   │   ├── upload/route.ts      # POST: subida a Cloudinary
    │   │   ├── seed/route.ts, seed-products/route.ts
    │   ├── admin/
    │   │   ├── layout.tsx           # requireAuth implícito vía isAuthenticated + AdminShell
    │   │   ├── AdminShell.tsx       # Shell con nav y logout
    │   │   ├── login/page.tsx       # Form login
    │   │   ├── page.tsx             # Dashboard
    │   │   ├── products/           # list, new, [id]/edit (VariantsManager)
    │   │   ├── categories/         # list, new, [id]/edit
    │   │   └── orders/             # list, [id] detalle
    │   ├── shop/
    │   │   ├── page.tsx             # Listado con filtro categoría y búsqueda (SSR, revalidate 300)
    │   │   └── [slug]/page.tsx      # Detalle producto (SSR) + ProductDetailClient (client)
    │   ├── cart/page.tsx            # Carrito (CartContext), resumen, envío $99 o gratis >$500
    │   ├── checkout/
    │   │   ├── page.tsx             # Form datos + LocationPicker, POST create-preference → redirect MP
    │   │   ├── success/page.tsx     # Busca orden por paymentId, clearCart
    │   │   ├── failure/page.tsx     # Mensaje pago rechazado
    │   │   ├── pending/page.tsx     # Pago pendiente (usa orderId en query)
    │   │   └── payment/page.tsx     # (existente en estructura)
    │   └── orders/[id]/confirmation/page.tsx
    ├── components/
    │   ├── Header.tsx
    │   ├── ProductCard.tsx
    │   ├── AddToCartButton.tsx
    │   ├── CategoryFilter.tsx
    │   └── LocationPicker.tsx      # Google Maps Places + geolocalización
    └── contexts/
        └── CartContext.tsx         # Carrito en estado + localStorage
```

---

## 2. Configuraciones Clave

| Ámbito | Archivo | Detalle |
|--------|---------|---------|
| **Next.js** | `next.config.ts` | `reactStrictMode`, `images.remotePatterns` (Cloudinary), `typescript.ignoreBuildErrors: false`, `compress`, `poweredByHeader: false`, headers de seguridad (HSTS, X-Frame-Options, etc.). No hay `eslint` en config (comentado; se usa `.eslintrc.json`). |
| **Prisma** | `prisma/schema.prisma` | `provider = "postgresql"`, `url = env("DATABASE_URL")`, `directUrl = env("DIRECT_URL")` (Supabase pooler vs directo). |
| **Supabase** | `.env` | `DATABASE_URL` (pooler, pgbouncer), `DIRECT_URL` (directo para migraciones/seed). |
| **Vercel** | `vercel.json` | Solo `buildCommand`: `prisma generate && next build`. |
| **Cloudinary** | `src/app/api/upload/route.ts` + env | Config con `cloud_name`, `api_key`, `api_secret`. Subida a carpeta `mi-tienda-virtual`. |
| **MercadoPago** | `src/app/lib/mercadopago.ts` | `MERCADOPAGO_ACCESS_TOKEN`, `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY`, `NEXT_PUBLIC_BASE_URL`. Back URLs: success, failure, pending. `notification_url` para webhook. **Logs de debugging en código** (console.log de existencia de token, baseUrl, etc.). |

---

## 3. Flujo Actual de Compra

### 3.1 Agregar producto al carrito

- **Tienda** (`/shop`): Grid de productos (SSR con Prisma). Cada producto usa `ProductCard` (enlace a `/shop/[slug]`).
- **Detalle** (`/shop/[slug]`): `ProductDetailClient` usa `useCart().addItem()` con: `id`, `name`, `slug`, `price`, `imageUrl`, `stock`, `variantId` (opcional), `variantDetails` (opcional). Permite cantidad y variantes (color/talla).
- **Carrito en memoria**: `CartContext` guarda ítems en estado React y persiste en `localStorage` bajo la clave `"cart"`. Clave de ítem: `productId` + `variantId` (si hay variante).

### 3.2 De carrito a checkout

- Usuario va a `/cart`. Resumen: subtotal, envío ($99 o gratis si total ≥ $500), total. Botón "Proceder al Pago" → `/checkout`.
- En **checkout** (`/checkout/page.tsx`): formulario (nombre, email, teléfono, dirección, ciudad, estado, CP, notas) + `LocationPicker` (Google Maps/geolocalización). Validación en cliente. No se crea orden en BD en este paso.

### 3.3 Procesamiento del pago con MercadoPago

1. **Crear preferencia (sin orden)**  
   - POST `/api/checkout/create-preference` con `customer`, `items` (productId, variantId, quantity, price), `total`, `shippingAddress`.  
   - Se valida stock (producto o variante), no se descuenta.  
   - Se arma body para MercadoPago (items, payer, back_urls, `notification_url`, `external_reference` = JSON con customer, items, total, shippingAddress).  
   - Respuesta: `initPoint`. Frontend hace `window.location.href = initPoint` (redirección a MercadoPago).

2. **Usuario paga en MercadoPago**  
   - MercadoPago redirige a success/failure/pending según resultado.

3. **Webhook**  
   - MercadoPago llama a `NEXT_PUBLIC_BASE_URL/api/webhooks/mercadopago` con `type: 'payment'`.  
   - Se obtiene el pago por ID, se parsea `external_reference` (JSON del checkout).  
   - Si `payment.status === 'approved'`: se crea o actualiza `Customer`, se genera `orderNumber`, se crea la **Order** en BD con ítems y se **descuenta stock** (producto o variante) en la misma transacción.  
   - La orden se crea con estado `PAID`. No se crea orden en create-preference ni antes del pago aprobado.

### 3.4 Después del pago

- **Success**: Redirección a `/checkout/success?payment_id=...`. La página hace GET `/api/orders?paymentId=...`, muestra la orden, hace `clearCart()` y limpia `localStorage` de `checkout_data`.
- **Failure**: `/checkout/failure` con mensaje y botones a carrito/tienda.
- **Pending**: `/checkout/pending?orderId=...`. Actualmente el flujo principal no pasa `orderId` en back_urls (solo en el flujo alternativo de `/api/mercadopago/create-preference` por orderId), por lo que en flujo normal MercadoPago puede redirigir a pending sin orderId; la página espera `orderId` y redirige a `/` si no existe.

---

## 4. Dependencias y Versiones

```json
"dependencies": {
  "@prisma/client": "^5.22.0",
  "autoprefixer": "^10.4.20",
  "cloudinary": "^2.5.1",
  "cookies-next": "^6.1.1",
  "lucide-react": "^0.263.1",
  "mercadopago": "^2.0.15",
  "next": "^16.1.1",
  "react": "^19.2.3",
  "react-dom": "^19.2.3"
},
"devDependencies": {
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^8",
  "eslint-config-next": "15.5.6",
  "postcss": "^8",
  "prisma": "^5.22.0",
  "tailwindcss": "^3.4.1",
  "tsx": "^4.7.0",
  "typescript": "^5"
}
```

- Next 16.1.1 con React 19.  
- Prisma y cliente 5.22.0.  
- `eslint-config-next` está en 15.5.6 (versión menor que Next 16; puede generar avisos).  
- No hay `tailwindcss-animate` en package.json (en el código se usa `animate-fadeIn`; verificar que esté definido en `tailwind.config.js` o `globals.css`).

---

## 5. Variables de Entorno (sin valores sensibles)

Solo nombres y propósito. Valores sensibles deben estar en `.env.local` o en Vercel y **nunca** en el reporte.

| Variable | Uso |
|----------|-----|
| `MERCADOPAGO_ACCESS_TOKEN` | API MercadoPago (backend). Valor: ***** |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Clave pública MP (frontend). Valor: ***** |
| `NEXT_PUBLIC_BASE_URL` | URL base (checkout, webhook, back URLs). Valor: ***** |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary (público). Valor: ***** |
| `CLOUDINARY_API_KEY` | Cloudinary (backend). Valor: ***** |
| `CLOUDINARY_API_SECRET` | Cloudinary (backend). Valor: ***** |
| `DATABASE_URL` | Conexión PostgreSQL (pooler Supabase). Valor: ***** |
| `DIRECT_URL` | Conexión directa PostgreSQL (migraciones/seed). Valor: ***** |
| `ADMIN_USERNAME` | Usuario panel admin. Valor: ***** |
| `ADMIN_PASSWORD` | Contraseña panel admin. Valor: ***** |
| `ADMIN_SESSION_SECRET` | Valor de la cookie `admin-session` (debe ser secreto fuerte). Valor: ***** |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps/Places (LocationPicker). Valor: ***** |
| `CLEANUP_SECRET` | Opcional, limpieza de órdenes. Valor: ***** |

**Importante:** En el código, `auth.ts` y `middleware.ts` usan fallbacks si no existe `ADMIN_SESSION_SECRET` (`'mi-secret-super-seguro-123'`). En producción no debe depender de ese valor por defecto.

---

## 6. Componentes Críticos

| Componente | Ubicación | Función |
|------------|-----------|---------|
| **CartContext** | `src/contexts/CartContext.tsx` | Estado del carrito (items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice). Persistencia en `localStorage` clave `"cart"`. Soporta variantes (variantId/variantDetails). |
| **LocationPicker** | `src/components/LocationPicker.tsx` | Input con autocompletado Google Places (restricción país `mx`). Botón "Mi Ubicación" usa `navigator.geolocation` y opcionalmente Geocoding para dirección. Sin API key funciona modo manual. Aviso si no es HTTPS (excepto localhost). |
| **Admin layout / auth** | `src/app/admin/layout.tsx`, `src/app/lib/auth.ts` | Layout llama a `isAuthenticated()`; no redirige (eso lo hace `middleware` para `/admin`). `AdminShell` recibe `authenticated` y `logoutAction` (server action que limpia cookie y redirige a `/admin/login`). |
| **ProductDetailClient** | `src/app/shop/[slug]/ProductDetailClient.tsx` | Selector de variantes (color/talla), cantidad, stock, `addItem` con variantId/variantDetails. |
| **AddToCartButton** | `src/components/AddToCartButton.tsx` | Usado en listados; añade producto sin variante y redirige a `/cart`. |
| **Header** | `src/components/Header.tsx` | Navegación y acceso al carrito (según implementación). |

---

## 7. API Routes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Body: `username`, `password`. Compara con env ADMIN_*. Si ok, set cookie `admin-session` (SESSION_SECRET). |
| POST | `/api/auth/logout` | Elimina cookie `admin-session`. |
| GET | `/api/products` | Lista productos (opcional `categoryId`). Incluye categoría y variantes activas. |
| POST | `/api/products` | Crea producto (name, slug, description, price, comparePrice, stock, imageUrl, categoryId). Convierte imageUrl a array `images`. |
| GET/PUT/DELETE | `/api/products/[id]` | GET incluye categoría. PUT actualiza campos; **problema**: usa `imageUrl` en `data` pero el modelo tiene `images` (array). DELETE borra producto. |
| GET/POST | `/api/products/[id]/variants` | CRUD variantes (color, size, sku, price, stock, imageUrl). |
| GET/PUT/DELETE | `/api/products/[id]/variants/[variantId]` | Una variante. |
| GET | `/api/categories` | Lista categorías con `_count.products`. |
| POST | `/api/categories` | Crea categoría (name, slug). |
| GET/PUT/DELETE | `/api/categories/[id]` | Una categoría. |
| POST | `/api/checkout/create-preference` | **Flujo principal.** Body: customer, items, total, shippingAddress. Verifica stock, crea preferencia MP, external_reference = JSON. Devuelve `initPoint`. No crea orden. |
| POST | `/api/mercadopago/create-preference` | Body: `orderId`. Crea preferencia para una orden ya existente (flujo alternativo). |
| POST | `/api/webhooks/mercadopago` | Recibe notificación MP. Si type `payment` y status `approved`, crea Customer/Order y descuenta stock. |
| GET | `/api/orders` | Query: `status`, `paymentId`. Lista órdenes con customer e items (product, variant). |
| POST | `/api/orders` | Crea orden + cliente y descuenta stock (flujo alternativo; no es el usado en checkout actual). |
| GET/PATCH | `/api/orders/[id]` | GET orden con customer e items. PATCH actualiza `status`. |
| POST | `/api/upload` | FormData con `file`. Sube a Cloudinary, devuelve `url` (secure_url). |
| GET/POST | `/api/seed`, `/api/seed-products` | Semilla (usar solo en dev). |

---

## 8. Base de Datos (Prisma Schema)

- **Category**: id (cuid), name (unique), slug (unique), createdAt, updatedAt. Relación 1:N con Product.
- **Product**: id, name, slug (unique), description, price, compareAtPrice, images (String[]), stock, isActive, categoryId. Relación con Category, OrderItem, ProductVariant.
- **ProductVariant**: id, productId, color, size, sku (unique), price, stock, imageUrl, isActive. Relación Product, OrderItem.
- **Customer**: id, name, email (unique), phone, address, city, state, zipCode, latitude, longitude.
- **Order**: id, orderNumber (unique), total, status (enum), paymentMethod, paymentId, shippingAddress, mercadoPagoId, notes, customerId. Relación Customer, OrderItem.
- **OrderItem**: id, quantity, price, orderId, productId, variantId (opcional). Relación Order, Product, ProductVariant (opcional).
- **OrderStatus**: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED.

Índices: categoryId y slug en Product; productId y sku en ProductVariant; customerId y orderNumber en Order; orderId, productId, variantId en OrderItem.

---

## 9. Problemas Potenciales

### Seguridad y buenas prácticas

- **Secreto admin por defecto:** En `auth.ts` y `middleware.ts`, si `ADMIN_SESSION_SECRET` no está definido se usa `'mi-secret-super-seguro-123'`. Cualquiera que conozca ese valor puede falsificar la cookie. En producción debe obligarse a definir el env.
- **Credenciales admin por defecto:** En login route, `ADMIN_USERNAME`/`ADMIN_PASSWORD` tienen fallback `'admin'`/`'admin123'`. Riesgo si no se configuran en producción.
- **Logs sensibles:** En `mercadopago.ts` se hace `console.log` de existencia de token y `accessToken?.substring(0, 15)`. Evitar en producción. En `create-preference/route.ts` hay muchos `console.log` con datos de request y preferencia.
- **Upload sin autenticación:** `POST /api/upload` no comprueba sesión admin; cualquiera podría subir archivos si conoce la ruta.
- **Webhook sin verificación de firma:** No se verifica que la petición al webhook venga realmente de MercadoPago (ej. firma o token). Aumenta riesgo de falsificación de notificaciones.

### Código y consistencia

- **PUT producto por ID:** En `api/products/[id]/route.ts` el update usa `imageUrl` (string), pero el modelo tiene `images` (String[]). Prisma no tiene campo `imageUrl` en Product; puede fallar en runtime o no actualizar imágenes.
- **Página success y orden:** La página de success busca orden por `paymentId`. El webhook puede no haberse ejecutado aún al llegar el usuario; podría mostrarse “sin orden” de forma transitoria. Opción: reintentos o mensaje “Procesando tu pedido…”
- **Pending y orderId:** En el flujo actual, create-preference no pasa `orderId` en back_urls. La página `/checkout/pending` espera `orderId` y hace fetch a `/api/orders/[id]`. Si MercadoPago redirige a pending sin query, la página redirige a `/` y no muestra orden (además, la orden se crea en el webhook, no antes, por lo que no hay orderId hasta después del webhook).
- **API orders [id] y pending:** GET `/api/orders/[id]` devuelve el objeto orden directamente. En `pending/page.tsx` se hace `setOrder(data.order)`; la respuesta es `data` = orden, por lo que debería ser `setOrder(data)`.
- **Dependencia cookies-next:** En el proyecto se usa `next/headers` (`cookies()`) para cookies en server. Revisar si `cookies-next` se usa en algún lado; si no, se puede quitar de dependencias.
- **Duplicado next.config:** Existen `next.config.ts` y `next.config.js`. Next suele usar uno solo; el otro puede generar confusión o sobrescritura.
- **Favicon en metadata:** En `layout.tsx` se referencia `"/Fabicon.ico"` (typo: “Fabicon” en lugar de “favicon”). Comprobar que el archivo en `public` coincida.

### Warnings posibles

- **Next.js y eslint-config-next:** Con Next 16, usar `eslint-config-next` 15 puede mostrar avisos de compatibilidad.
- **Geolocalización:** LocationPicker indica que en HTTP (no localhost) la geolocalización puede fallar; en producción debe usarse HTTPS.
- **Prisma en desarrollo:** En `prisma.ts` se hace `prisma.$connect()` y log en consola; correcto para dev, asegurarse de no dejar logs sensibles en prod.

---

## 10. Recomendaciones de Optimización

- **Eliminar logs de producción:** Quitar todos los `console.log` de `mercadopago.ts` y de `api/checkout/create-preference/route.ts` (o envolver en `NODE_ENV === 'development'`).
- **Proteger upload:** Restringir `POST /api/upload` a usuarios autenticados (por ejemplo, comprobar cookie admin en un middleware o dentro del route).
- **Validar webhook MercadoPago:** Implementar verificación de firma o de origen de la notificación según documentación de MercadoPago.
- **Corregir PUT producto:** En `api/products/[id]` aceptar `images` (array) o un solo `imageUrl` y mapear a `images: imageUrl ? [imageUrl] : []` para no escribir `imageUrl` en el modelo.
- **Success page:** Considerar reintentos al buscar la orden por `paymentId` o mensaje tipo “Estamos confirmando tu pago” mientras no exista la orden.
- **Pending page:** Ajustar flujo: o bien pasar algo en back_urls de MercadoPago (ej. `payment_id`) y en pending buscar orden por `paymentId`, o documentar que “pending” sin orderId solo muestra mensaje genérico. Corregir `setOrder(data.order)` → `setOrder(data)` cuando la API devuelve la orden en el cuerpo directamente.
- **Variables de entorno:** No usar fallbacks para `ADMIN_SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` en producción; fallar arranque o login si no están definidos.
- **Un solo next.config:** Dejar solo `next.config.ts` (o solo `.js`) y eliminar el otro para evitar dudas.
- **Favicon:** Corregir ruta en metadata a `"/favicon.ico"` y nombre del archivo en `public` si aplica.
- **ESLint:** Actualizar `eslint-config-next` a versión compatible con Next 16 cuando exista.
- **Revisar uso de cookies-next:** Si no se usa en cliente, eliminar de `package.json`.

---

*Reporte generado por análisis estático del código. No se ejecutaron comandos destructivos ni se modificaron archivos.*
