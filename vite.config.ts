import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';

// ---------------------------------------------------------------------------
// Dev-only middleware — simulates the /api/google-reviews Vercel serverless
// function so that `npm run dev` can fetch real Google reviews without CORS.
// ---------------------------------------------------------------------------
function googleReviewsDevPlugin(apiKey: string): Plugin {
  const PLACE_ID = 'ChIJmUOqMVeamWsRX0ZjXdptY18'; // Vance Graphix & Print

  return {
    name: 'google-reviews-dev',
    apply: 'serve', // dev server only — not included in production build
    configureServer(server) {
      server.middlewares.use('/api/google-reviews', async (req: any, res: any) => {
        if (req.method !== 'GET') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Method not allowed' }));
          return;
        }
        if (!apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Google Places API key not configured' }));
          return;
        }
        const url =
          `https://maps.googleapis.com/maps/api/place/details/json` +
          `?place_id=${PLACE_ID}` +
          `&fields=name,rating,user_ratings_total,reviews` +
          `&reviews_sort=newest` +
          `&key=${apiKey}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          if (data.status !== 'OK') {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Google Places API: ${data.status} — ${data.error_message || ''}` }));
            return;
          }
          const { name, rating, user_ratings_total, reviews } = data.result;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ name, rating, totalReviews: user_ratings_total, reviews: reviews || [] }));
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: err.message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      tailwindcss(),
      googleReviewsDevPlugin(env.GOOGLE_PLACES_API_KEY || env.VITE_GOOGLE_PLACES_API_KEY || ''),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'shopify.png'],
        manifest: {
          name: 'VGP Admin',
          short_name: 'VGP',
          description: 'Vance Graphix & Print (VGP) Admin Dashboard',
          theme_color: '#0f172a',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/admin/dashboard',
          icons: [
            { src: 'shopify.png', sizes: '192x192', type: 'image/png' },
            { src: 'shopify.png', sizes: '512x512', type: 'image/png' }
          ]
        }
      })
    ],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY || env.FIREBASE_API_KEY),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN || env.FIREBASE_AUTH_DOMAIN),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID || env.FIREBASE_PROJECT_ID),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET || env.FIREBASE_STORAGE_BUCKET),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID || env.FIREBASE_MESSAGING_SENDER_ID),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID || env.FIREBASE_APP_ID),
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, '.') }
    }
  };
});
