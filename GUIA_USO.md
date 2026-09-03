# 📸 Guía Oficial de Uso: Panel Privado de Cristian Espinola

Bienvenido a tu nuevo **Panel de Administración Privado**. Tu sitio web ahora utiliza una arquitectura híbrida de alto rendimiento:
* **Firebase Authentication:** Acceso seguro por correo y contraseña solo para ti.
* **Firebase Firestore:** Base de datos en tiempo real para organizar los 26 slots de tu portafolio.
* **Cloudinary CDN (100% Gratuito y sin tarjeta):** Alojamiento en la nube de alta velocidad con compresión automática a WebP y AVIF.

---

## 1. ¿Cómo acceder a tu Panel Privado?

Para garantizar máxima seguridad, el panel de administración **no tiene ningún botón ni enlace público en la web**. Solo tú conoces la ruta secreta:

👉 **Enlace Secreto:** **`https://crphotoweb.vercel.app/panel-8f3k2xq1`**

> **💡 Consejo:** Abre este enlace en el navegador de tu teléfono móvil (Safari en iPhone o Chrome en Android) y selecciona *"Añadir a la pantalla de inicio"*. De este modo, tendrás un icono en tu pantalla como si fuera una aplicación nativa para gestionar tu portafolio en cualquier momento.

---

## 2. Primer Inicio de Sesión y Creación del Usuario Admin

Tu panel utiliza **Firebase Authentication** con correo y contraseña.

### Para registrar tu correo de administrador en Firebase (toma 1 minuto):
1. Entra a la consola de [Firebase Console](https://console.firebase.google.com/).
2. Selecciona tu proyecto: **`crphotos`**.
3. En el menú izquierdo ve a **Build (Compilación) → Authentication**.
4. Haz clic en **"Get Started"** (si aún no está activo) y activa el método **"Correo electrónico / Contraseña"**.
5. En la pestaña **"Users" (Usuarios)**, haz clic en **"Add user" (Añadir usuario)**.
6. Escribe tu correo (ej: `Christianespinolas2317@gmail.com`) y define una contraseña segura.
7. ¡Listo! Con esas credenciales podrás entrar a tu panel privado.

---

## 3. ¿Cómo subir, reemplazar y eliminar fotos?

El panel organiza las 26 secciones de tu web en 3 pestañas: **Inicio**, **Sobre Mí** y **Tarifas**.

### A. Subir una nueva fotografía:
1. Dirígete a la tarjeta de la sección deseada.
2. Si la sección tiene cupos disponibles, verás un recuadro que dice:
   *`+ Subir Fotografía (Espacio disponible: X de Y)`*
3. Toca el recuadro, selecciona la foto de tu galería en alta resolución (JPG, PNG o WebP).
4. Verás una barra de progreso que indica el porcentaje de subida.
5. Al terminar, la foto se procesa y optimiza en Cloudinary y se refleja al instante en tu web pública.

### B. Control estricto de cupos (Límite alcanzado):
* Cuando una sección alcanza su número máximo de fotos diseñadas (ej: 4 de 4 en la Galería de Portafolio), la tarjeta cambiará a estado **LÍMITE ALCANZADO**.
* El botón de subida se bloqueará automáticamente para proteger el diseño y te indicará que debes **eliminar** o **reemplazar** una foto existente antes de subir otra.

### C. Reemplazar una foto:
* Cada foto subida cuenta con un botón **"Reemplazar"**.
* Al tocarlo, se abrirá tu galería para elegir la nueva foto, sustituyendo la anterior de forma limpia y manteniendo su posición exacta en la web.

### D. Eliminar una foto:
* Cada foto cuenta con un botón **"Eliminar"**.
* Al tocarlo, el panel mostrará una ventana de confirmación para evitar borrados accidentales. Al confirmar, se eliminará tanto de la web pública como de Cloudinary.

---

## 4. ¿Cómo cambiar la ruta secreta en el futuro?

Si alguna vez deseas cambiar la URL secreta del panel:
1. Abre el archivo `src/config/admin.ts`.
2. Modifica el valor de `ADMIN_SECRET_SLUG`:
   ```ts
   export const ADMIN_SECRET_SLUG = 'panel-tu-nueva-clave-aqui';
   ```
3. Guarda el archivo y sube los cambios con `git push`. La nueva URL estará activa en segundos.

---

## 5. Reglas de Seguridad de Firestore

Para asegurar que nadie pueda manipular tus imágenes desde fuera del panel, hemos incluido el archivo `firestore.rules`:

### Para aplicarlo en tu consola de Firebase:
1. En **Firebase Console → Firestore Database → Rules (Reglas)**: Copia y pega el contenido de [firestore.rules](file:///c:/Users/Usuario/Desktop/crphoto_web/firestore.rules) y pulsa **Publish**.

Con esto, cualquier persona que no haya iniciado sesión con tu correo admin tendrá **bloqueada la escritura** a nivel de servidor de Google.

---

¡Disfruta de tu panel de administración a medida, ultrarrápido, seguro y con costo $0 real garantizado! 🚀
