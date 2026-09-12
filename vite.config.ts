import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

function imageSavePlugin(): Plugin {
  return {
    name: 'stone-image-saver',
    configureServer(server) {
      server.middlewares.use('/api/save-stone-image', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { filename, base64Data } = JSON.parse(body);
            if (!filename || !base64Data) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing filename or base64Data' }));
              return;
            }
            const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(cleanBase64, 'base64');
            const targetDir = path.resolve(process.cwd(), 'public/images/products');
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }
            const targetPath = path.join(targetDir, filename);
            fs.writeFileSync(targetPath, buffer);
            
            if (filename === 'black-chemical-chips.jpg' || filename === 'chemical-flooring-hallway.jpg') {
              const projectDir = path.resolve(process.cwd(), 'public/images/projects');
              if (!fs.existsSync(projectDir)) {
                fs.mkdirSync(projectDir, { recursive: true });
              }
              fs.writeFileSync(path.join(projectDir, 'chemical-flooring-hallway.jpg'), buffer);
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, path: `/images/products/${filename}` }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err?.message || 'Failed to save image' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), imageSavePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
