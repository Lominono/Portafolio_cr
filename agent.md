# Directrices de Diseño y Desarrollo para Agentes de IA

Este documento contiene las reglas fundamentales que todo agente de IA debe seguir al modificar o expandir esta web. El objetivo principal es mantener un diseño profesional, de alta calidad y evitar a toda costa el aspecto genérico o "hecho por IA".

## 1. Identidad Visual y Paleta de Colores
Deben respetarse estrictamente los siguientes códigos hexadecimales:
- **Fondo Principal (60%):** `#FFFFFF` (Blanco Puro) - Usado para dar respiro y minimalismo.
- **Texto Principal y Encabezados (30%):** `#2C2C2C` (Gris Carbón / Grafito Suave) - Para alto contraste sin la dureza del negro puro.
- **Texto Secundario y Menú Interactivo:** `#5A5A5A` (Gris Medio) - Para jerarquía visual secundaria.
- **Color de Acento / Botones Principal (10%):** `#8C6D58` (Marrón Cobre / Bronce Cálido) - Para llamadas a la acción (CTAs) y detalles clave.
- **Color de Acento Secundario:** `#B3927B` (Beige Bronce) - Para líneas divisorias sutiles, hover states y bordes de tarjetas secundarias.

## 2. Tipografía
La tipografía es clave para un diseño premium:
- **Logotipo / Títulos Principales:** Fuente Serif elegante (ej. `Playfair Display`, `Cinzel` o `Cormorant Garamond`). 
  - Regla: Siempre en **MAYÚSCULAS**.
  - Regla: `letter-spacing` amplio, entre `2px` y `3px`.
- **Menú de Navegación y Textos (Párrafos):** Fuente Sans-serif limpia (ej. `Montserrat`, `Lato`, `Inter`).
  - Regla: Peso normal (`300` o `400`).

## 3. Elementos de Interfaz (UI)
- **Botones de Acción (CTAs):**
  - Fondo: `#8C6D58`
  - Texto: `#FFFFFF` (Blanco)
  - Tipografía: Sans-serif o Serif en MAYÚSCULAS.
  - Bordes: Rectos (`0px`) o con un `border-radius` mínimo de `2px`. Nunca usar bordes muy redondeados tipo "píldora".
- **Bordes y Enmarcados:** 
  - Usar una línea muy fina de `1px` sólida en color `#B3927B` alrededor de las tarjetas de fotos secundarias para un toque de elegancia.
- **Iconografía (Redes Sociales, Footer):**
  - Mantenerlos limpios, minimalistas y pequeños.
  - Color: `#2C2C2C` o `#5A5A5A`.

## 4. Animaciones y Experiencia de Usuario
- Utilizar **GSAP** (GreenSock Animation Platform) para animaciones fluidas, naturales y con buen rendimiento.
- Evitar animaciones exageradas o "bouncy" que parezcan baratas. Preferir *fade-ins* suaves, revelados de texto sutiles y efectos parallax delicados al hacer scroll.
- Asegurarse de limpiar las animaciones de GSAP al desmontar componentes en React (usar `@gsap/react`).

## 5. Responsividad (Mobile First)
- La web debe verse espectacular tanto en dispositivos móviles, tablets como en laptops y PCs.
- El diseño debe adaptarse, reorganizando galerías a una columna en móvil, y cuadrículas de 2 a 4 columnas en escritorio.

## 6. Filosofía Anti "Diseño IA"
- **Evitar:** Textos genéricos, gradientes excesivos, sombras paralelas (box-shadows) pesadas y oscuras, y bordes excesivamente redondeados.
- **Priorizar:** Espacio en blanco (Negative space), alineación perfecta, contrastes sutiles y atención meticulosa al detalle en tipografía.
