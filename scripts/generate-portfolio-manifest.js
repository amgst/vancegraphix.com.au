import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const portfolioDir = path.join(rootDir, 'public', 'Portfolio');
const manifestPath = path.join(rootDir, 'public', 'portfolio-manifest.json');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

const toWebPath = (filePath) => filePath.split(path.sep).join('/');

const getImageFiles = (dirPath) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .filter((entry) => imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => `/Portfolio/${toWebPath(path.join(path.basename(dirPath), entry.name))}`)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
};

const main = () => {
  if (!fs.existsSync(portfolioDir)) {
    const emptyManifest = {
      generatedAt: new Date().toISOString(),
      categories: {}
    };
    fs.writeFileSync(manifestPath, `${JSON.stringify(emptyManifest, null, 2)}\n`, 'utf8');
    console.log('Portfolio folder not found. Wrote empty manifest.');
    return;
  }

  const categories = {};
  const folderEntries = fs.readdirSync(portfolioDir, { withFileTypes: true });

  for (const folder of folderEntries) {
    if (!folder.isDirectory()) continue;
    const folderPath = path.join(portfolioDir, folder.name);
    const images = getImageFiles(folderPath);
    if (images.length > 0) {
      categories[folder.name] = images;
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    categories
  };

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Generated ${manifestPath}`);
  console.log(`Categories: ${Object.keys(categories).length}`);
};

main();
