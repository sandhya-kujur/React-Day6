import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    proxy: {
      '/api/encr-decr': {
        target: 'https://encr-decr.iserveu.online',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/encr-decr/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'https://nsdl-web-stage.web.app');
            proxyReq.setHeader('Referer', 'https://nsdl-web-stage.web.app/');
          });
        }
      },
      '/api/services-encr': {
        target: 'https://services-encr.iserveu.online',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/services-encr/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Origin', 'https://nsdl-web-stage.web.app');
            proxyReq.setHeader('Referer', 'https://nsdl-web-stage.web.app/');
          });
        }
      }
    }
  }
})
