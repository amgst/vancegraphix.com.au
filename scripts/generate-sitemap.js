
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get absolute path from project root
const resolve = (...args) => path.join(__dirname, '..', ...args);

// Configuration
const BASE_URL = 'https://www.wbify.com';
const OUTPUT_FILE = resolve('public', 'sitemap.xml');
const BLOG_DATA_FILE = resolve('data', 'blog-posts.json');

// Static Routes - Add all your main pages here
const staticRoutes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/services', changefreq: 'weekly', priority: 0.9 },
    { url: '/shopify', changefreq: 'weekly', priority: 0.8 },
    { url: '/web-dev', changefreq: 'weekly', priority: 0.8 },
    { url: '/graphics', changefreq: 'weekly', priority: 0.8 },
    { url: '/pricing', changefreq: 'monthly', priority: 0.8 },
    { url: '/portfolio', changefreq: 'weekly', priority: 0.8 },
    { url: '/blog', changefreq: 'weekly', priority: 0.8 },
    { url: '/tools', changefreq: 'monthly', priority: 0.7 },
    { url: '/websites-for-sale', changefreq: 'weekly', priority: 0.8 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/inquiry', changefreq: 'monthly', priority: 0.6 },
    { url: '/careers', changefreq: 'monthly', priority: 0.6 },
    { url: '/privacy-policy', changefreq: 'monthly', priority: 0.5 },
    { url: '/terms-and-conditions', changefreq: 'monthly', priority: 0.5 },
];

async function generateSitemap() {
    try {
        console.log('Starting sitemap generation...');

        let urls = [...staticRoutes];

        // Read Blog Data
        if (fs.existsSync(BLOG_DATA_FILE)) {
            const blogData = JSON.parse(fs.readFileSync(BLOG_DATA_FILE, 'utf-8'));
            console.log(`Found ${blogData.length} blog posts.`);

            const blogUrls = blogData.map(post => ({
                url: `/blog/${post.slug}`,
                changefreq: 'monthly',
                priority: 0.7,
                lastmod: post.date // Use the blog post date as lastmod
            }));

            urls = [...urls, ...blogUrls];
        } else {
            console.warn(`Warning: Blog data file not found at ${BLOG_DATA_FILE}`);
        }

        // Generate XML
        const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(route => `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

        // Write to file
        fs.writeFileSync(OUTPUT_FILE, sitemapXml);
        console.log(`Sitemap generated successfully at ${OUTPUT_FILE}`);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
