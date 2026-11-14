import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT && process.env.PORT !== '8080' ? process.env.PORT : '3000';
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Security Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://docs.opencv.org https://cdnjs.cloudflare.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; media-src 'self' blob:; connect-src 'self' https:;");
    next();
  });

  // Mount Vite middleware in development mode
  if (!isProduction) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'custom'
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn('[Server] Unable to attach Vite middlewares, falling back to static server:', e);
    }
  }

  // Explicit route for favicons, touch icons & WhatsApp OG preview image (no redirects, direct 200 response)
  app.get([
    '/favicon.ico',
    '/favicon.png',
    '/favicon-48x48.png',
    '/favicon-96x96.png',
    '/favicon-144x144.png',
    '/apple-touch-icon.png',
    '/og-preview.jpg'
  ], (req, res) => {
    const filename = path.basename(req.path);
    const distFavicon = path.resolve(__dirname, 'dist', filename);
    const publicFavicon = path.resolve(__dirname, 'public', filename);
    const rootFavicon = path.resolve(__dirname, filename);
    const targetPath = fs.existsSync(distFavicon) ? distFavicon :
                       fs.existsSync(publicFavicon) ? publicFavicon :
                       fs.existsSync(rootFavicon) ? rootFavicon : null;
    if (targetPath) {
      const mimeType = filename.endsWith('.ico') ? 'image/x-icon' : filename.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.sendFile(targetPath);
    }
    res.status(404).send('Asset not found');
  });

  // Explicit route for sw.js to prevent redirect issues
  app.get('/sw.js', (req, res) => {
    const swPath = path.resolve(__dirname, 'dist/sw.js');
    if (fs.existsSync(swPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Service-Worker-Allowed', '/');
      return res.sendFile(swPath);
    }
    const publicSwPath = path.resolve(__dirname, 'public/sw.js');
    if (fs.existsSync(publicSwPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Service-Worker-Allowed', '/');
      return res.sendFile(publicSwPath);
    }
    res.status(404).send('Service worker file not found');
  });

  // Explicit route for workbox files
  app.get('/workbox-*.js', (req, res) => {
    const fileName = path.basename(req.path);
    const wbPath = path.resolve(__dirname, 'dist', fileName);
    if (fs.existsSync(wbPath)) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      return res.sendFile(wbPath);
    }
    res.status(404).send('Workbox script not found');
  });

  // Explicit route for social preview banner assets (WhatsApp, Facebook, Twitter)
  app.get(['/assets/aistudio/:filename', '/public/assets/aistudio/:filename'], (req, res) => {
    const filename = req.params.filename;
    const publicAssetPath = path.resolve(__dirname, 'public/assets/aistudio', filename);
    const rootAssetPath = path.resolve(__dirname, 'assets/aistudio', filename);
    const distAssetPath = path.resolve(__dirname, 'dist/assets/aistudio', filename);

    const targetPath = fs.existsSync(publicAssetPath) ? publicAssetPath :
                       fs.existsSync(rootAssetPath) ? rootAssetPath :
                       fs.existsSync(distAssetPath) ? distAssetPath : null;

    if (targetPath) {
      const ext = path.extname(targetPath).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      return res.sendFile(targetPath);
    }
    res.status(404).send('Asset image not found');
  });

  // Explicit route for tutorial videos & posters (supports HTTP Range 206 streaming & proper 404)
  app.get('/videos/:filename', (req, res) => {
    const filename = path.basename(req.params.filename);
    const distVideoPath = path.resolve(__dirname, 'dist/videos', filename);
    const publicVideoPath = path.resolve(__dirname, 'public/videos', filename);
    const targetPath = fs.existsSync(distVideoPath) ? distVideoPath :
                       fs.existsSync(publicVideoPath) ? publicVideoPath : null;

    if (targetPath) {
      return res.sendFile(targetPath);
    }
    res.status(404).send('Tutorial video not found');
  });

  // Serve static assets from built dist if present
  const distPath = path.resolve(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath, {
      index: false,
      redirect: false
    }));
  }

  // Serve static assets from public if present
  const publicPath = path.resolve(__dirname, 'public');
  if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath, {
      index: false,
      redirect: false
    }));
  }

  // Fallback HTML navigation handler
  app.get('*', (req, res) => {
    const distIndex = path.resolve(__dirname, 'dist/index.html');
    if (fs.existsSync(distIndex)) {
      return res.sendFile(distIndex);
    }
    const rootIndex = path.resolve(__dirname, 'index.html');
    if (fs.existsSync(rootIndex)) {
      return res.sendFile(rootIndex);
    }
    res.status(404).send('Index page not found. Please build the application.');
  });

  const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[SMART VLE TOOL Server] Running on port ${PORT}`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use.`);
      process.exit(1);
    } else {
      throw e;
    }
  });
}

startServer();
