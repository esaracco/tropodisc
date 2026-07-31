import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  const proxy = {};
  if (env.VITE_SET_LEDS === 'yes') {
    proxy['/api'] = {
      target: `http://localhost:${env.VITE_LEDS_API_PORT || 10000}`,
      changeOrigin: true,
    };
  }

  return {
    plugins: [
      react(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'service-worker.js',
        manifest: false,
        injectRegister: null,
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json}']
        }
      })
    ],
    server: {
      port: 3000,
      proxy: proxy,
    },
    build: {
      outDir: 'build',
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    }
  };
});
