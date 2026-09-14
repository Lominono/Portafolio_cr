# Directrices de Diseño y Desarrollo para Agentes

Este proyecto combina las directrices de identidad de marca del portafolio con las skills obligatorias:
- **`frontend-design`** (diseño visual distintivo, intencionado, anti-clichés de IA)
- **`apple-ui-design`** (sistema de diseño Apple, cuadrícula de 8pt, glassmorphism semántico, físicas y curvas iOS)

Estas directrices deben aplicarse **siempre** en cualquier tarea de frontend, interfaz, maquetación o estilos.

---

## 1. Identidad Visual del Portafolio y Paleta
- **Fondo Principal (60%):** `#FFFFFF` (Blanco Puro)
- **Texto Principal y Encabezados (30%):** `#2C2C2C` (Gris Carbón / Grafito Suave)
- **Texto Secundario y Menú Interactivo:** `#5A5A5A` (Gris Medio)
- **Color de Acento / Botones Principal (10%):** `#8C6D58` (Marrón Cobre / Bronce Cálido)
- **Color de Acento Secundario:** `#B3927B` (Beige Bronce)

---

## 2. Tipografía y Jerarquía
- **Títulos y Logotipo:** Serif elegante (`Playfair Display`, `Cinzel` o `Cormorant Garamond`), con `letter-spacing: -0.022em` (o espaciado amplio 2-3px en logotipos).
- **Cuerpo y Navegación:** Sans-serif nativa de alta fidelidad (`-apple-system`, `BlinkMacSystemFont`, `SF Pro Text`, `Montserrat`, `Lato`, `Inter`), con `letter-spacing: -0.011em`, interlineado de 1.5 y peso 400.
- **Largo de línea:** Menos de 80 caracteres por línea para legibilidad óptima.

---

## 3. Reglas Estrictas del Sistema de Diseño Apple (`apple-ui-design`)
- **Sistema de Cuadrícula 8pt:**
  - Todos los márgenes, rellenos (padding) y separaciones (gap) DEBEN ser múltiplos de 8px (8px, 16px, 24px, 32px, 48px, etc.).
- **Radios de Borde (Corner Radii):**
  - Botones y CTAs: `12px` (o con acabado sutil según estilo del portfolio, nunca píldora genérica).
  - Tarjetas y Modales: `20px`.
  - Elementos pequeños (Badges/Tags): `8px`.
- **Áreas táctiles e interactivas:** Altura mínima de `44px` (estándar iOS).
- **Glassmorphism / Materiales translúcidos:**
  - Fondo: `rgba(255, 255, 255, 0.72)`.
  - Filtro: `backdrop-filter: blur(20px) saturate(180%)`.
  - Borde: `0.5px solid rgba(0, 0, 0, 0.1)` o `1px solid #B3927B`.
- **Físicas y Animaciones (iOS Spring / GSAP):**
  - Transición estándar: `300ms cubic-bezier(0.25, 0.1, 0.25, 1)`.
  - Modales y revelados: `cubic-bezier(0.4, 0, 0.2, 1.4)`.
  - Hover: `scale(1.02)` + sombra delicada; Active / Tap: `scale(0.96)`.
  - Integrar animaciones fluidas con GSAP (`@gsap/react`), evitando movimientos exagerados o "bouncy".

---

## 4. Principios de Frontend Design (`frontend-design`)
- **Anti "Diseño IA":**
  - Prohibido el kit genérico SaaS (todo metido en tarjetas idénticas con gradientes y sombras grises predecibles).
  - Prohibido abusar de etiquetas innecesarias en mayúsculas ("eyebrows"), separadores tipo middle dot (`·`) o em dashes arbitrarios.
  - Numeraciones (`01`, `02`) solo si el contenido es realmente secuencial.
- **Plan en dos fases:** Planificar tokens y contrastar con la intención del diseño antes de escribir código.
- **Copywriting intencionado:** Textos activos, directos y naturales para el usuario.
