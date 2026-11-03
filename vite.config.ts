import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function logoUploadPlugin(): Plugin {
  return {
    name: 'logo-upload-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-logo', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(chunk));
          req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const publicPath = path.resolve(__dirname, 'public/school_emblem.png');
            fs.writeFileSync(publicPath, buffer);
            try {
              const assetsDir = path.resolve(__dirname, 'src/assets');
              if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
              fs.writeFileSync(path.resolve(assetsDir, 'school_emblem.png'), buffer);
            } catch (_) {}
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: '/school_emblem.png' }));
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), logoUploadPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
