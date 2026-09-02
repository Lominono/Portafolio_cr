# 📸 Guía Oficial de Uso: Portafolio de Cristian Espinola

¡Felicidades por tu nueva página web! Esta plataforma ha sido construida con tecnología de vanguardia (React, Vite, GSAP y Tailwind) para que cargue a la velocidad de la luz y ofrezca una experiencia premium a tus clientes.

Lo más importante: **Tu web es completamente autogestionable**. No necesitas tocar código para cambiar tus fotografías. Tienes un "Panel de Administración" profesional que hace todo el trabajo pesado por ti.

Aquí tienes el paso a paso de cómo manejar tu página web para el resto de la vida.

---

## 1. ¿Cómo acceder a tu Panel de Administración?

Tu panel de control (creado con Sanity Studio) vive de forma independiente a la web para mayor seguridad. 

### Opción A: Abrirlo desde tu ordenador (Local)
1. Abre tu proyecto (`crphoto_web`) en **Visual Studio Code**.
2. Abre la terminal superior y escribe el comando para entrar a la carpeta del panel:
   ```bash
   cd studio
   ```
3. Enciende el panel escribiendo:
   ```bash
   npm run dev
   ```
4. Haz clic en el enlace que te aparecerá (usualmente `http://localhost:3333`) y accede con tu cuenta de GitHub o Google.

### Opción B: Subirlo a Internet (Para entrar desde tu móvil)
Si quieres poder subir fotos estando de viaje sin usar VS Code, puedes publicar tu panel gratis en un servidor privado:
1. En la terminal de VS Code, dentro de la carpeta `studio`, escribe:
   ```bash
   npx sanity deploy
   ```
2. El sistema te pedirá un nombre (ej. `cristianphotos`).
3. Te dará un enlace mágico (ej. `https://cristianphotos.sanity.studio`). Guarda ese enlace en los favoritos de tu navegador. Ahora puedes entrar a tu panel desde cualquier lugar del mundo.

---

## 2. ¿Cómo subir y cambiar fotos en tu web?

El panel ahora está organizado de forma ultra visual por carpetas para cada página de tu web:

1. Entra a tu Panel de Administración: **`https://cristianphotos.sanity.studio`**
2. En el menú de la izquierda verás carpetas claras e intuitivas:
   * **🏠 Página de Inicio**
     * *📸 Retrato "Sobre Mí" (Máx. 1 foto)*
     * *🖼️ Galería Portafolio Principal (4 fotos recomendadas)*
   * **👤 Página "Sobre Mí"**
     * *📸 Retrato Principal de Cristian (1 foto de autor)*
     * *🎞️ Galería Detalles y Enfoque (2 fotos)*
   * **🏷️ Página de Tarifas y Servicios**
     * *💍 Portada Servicio: Bodas (1 foto)*
     * *🎭 Portada Servicio: Retrato / Moda (1 foto)*
     * *🎂 Portada Servicio: Eventos / 15 Años (1 foto)*
   * **📁 Todas las Fotografías (Listado Global)**: Para buscar o ver todo en un solo lugar.
3. Entra directamente a la carpeta donde quieras cambiar la foto (ej: *Página de Inicio → Galería Portafolio*).
4. Haz clic en **"Create New"** arriba a la derecha:
   * **La sección se autoselecciona sola**, ¡no tienes que buscarla en ningún menú!
   * **Título:** Escribe un nombre para identificar la foto (Ej. "Boda Marta y Juan - Sesión Bosque").
   * **Fotografía:** Arrastra tu foto en alta calidad (JPG, PNG o WebP).
5. **Punto focal (Hotspot):** Haz clic en el círculo sobre la foto para centrar la cara del cliente. Así, cuando un usuario entre desde el móvil, la foto se recortará automáticamente sin cortar nunca el rostro.
6. Haz clic en el botón verde **"Publish"** abajo a la derecha.

¡Listo! Si entras a tu web en Vercel y recargas, tu foto aparecerá en su lugar exacto, optimizada y nítida.

---

## 3. ¿Cómo funcionan las secciones y los huecos?

Tu web tiene los siguientes "huecos" disponibles para rellenar desde Sanity:

*   **Página de Inicio:**
    *   1 hueco para el "Retrato Sobre Mí".
    *   4 huecos para la "Galería de Portafolio Principal". *(Si subes 4 fotos con esta etiqueta, rellenarán la grilla automáticamente).*
*   **Página Sobre Mí:**
    *   1 hueco para el "Retrato Principal" (tu foto de autor).
    *   2 huecos para "Galería Detalles" (fotos estilo de vida o herramientas).
*   **Página de Tarifas:**
    *   1 hueco para *"Tarifas - Bodas"*.
    *   1 hueco para *"Tarifas - Retrato / Moda"*.
    *   1 hueco para *"Tarifas - Cumpleaños / 15 Años / Bautizos"*.

**¿Qué pasa si no subo foto a un hueco?**
No pasa nada. La web está diseñada para mostrar un elegante marco minimalista gris claro que dice "Espacio para foto" de forma que nunca se vea un error o una imagen rota.

---

## 4. Formularios Inteligentes

La sección de **Contacto** y los botones de **"Consultar Disponibilidad"** en la página de tarifas ya están programados con una lógica inteligente:
*   Si el cliente entra desde su **Móvil**, al tocar los botones se abrirá automáticamente su App oficial de Mail (iPhone/Android) o su WhatsApp directo.
*   Si el cliente entra desde un **Ordenador**, la web abrirá elegantemente Gmail Web o WhatsApp Web en una pestaña nueva, evitando los clásicos errores de Windows.

Tú recibirás todos los mensajes directamente en `Christianespinolas2317@gmail.com` o en tu número `+34 640 64 69 63`.

---

¡Disfruta de tu nueva plataforma fotográfica! 🚀
