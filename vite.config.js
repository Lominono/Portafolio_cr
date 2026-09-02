import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
export default defineConfig({
    plugins: [
        react(),
        ViteImageOptimizer({
            // Opciones para asegurar la máxima calidad pero con gran compresión para web
            jpg: {
                quality: 80,
            },
            jpeg: {
                quality: 80,
            },
            png: {
                quality: 85,
            },
            webp: {
                quality: 85,
            },
            // Habilita la conversión a WebP si es posible, es mejor para performance
        }),
    ],
});
