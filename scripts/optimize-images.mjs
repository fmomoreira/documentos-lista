import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets');

const LOGO_URL =
  'https://saojosedobelmonte.pe.gov.br/new/wp-content/uploads/2025/01/Logo-Prefeitura-de-Belmonte-01.png';

const SITE_URL = 'https://documentacao.saojosedobelmonte.pe.gov.br';

async function downloadLogo() {
  const response = await fetch(LOGO_URL);
  if (!response.ok) {
    throw new Error(`Falha ao baixar logo: ${response.status} ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function optimizeImages() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log('⬇️  Baixando logo...');
  const source = await downloadLogo();

  const metadata = await sharp(source).metadata();
  const maxWidth = 800;

  const resized = sharp(source).resize({
    width: Math.min(metadata.width || maxWidth, maxWidth),
    withoutEnlargement: true,
  });

  console.log('🖼️  Gerando PNG otimizado...');
  await resized
    .clone()
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toFile(path.join(OUT_DIR, 'logo.png'));

  console.log('🖼️  Gerando WebP...');
  await resized
    .clone()
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(OUT_DIR, 'logo.webp'));

  console.log('🖼️  Gerando AVIF...');
  await resized
    .clone()
    .avif({ quality: 65, effort: 6 })
    .toFile(path.join(OUT_DIR, 'logo.avif'));

  const meta = await sharp(path.join(OUT_DIR, 'logo.png')).metadata();

  const manifest = {
    width: meta.width,
    height: meta.height,
    ogImage: `${SITE_URL}/assets/logo.webp`,
  };

  await fs.writeFile(path.join(OUT_DIR, 'logo-manifest.json'), JSON.stringify(manifest, null, 2));

  const sizes = await Promise.all(
    ['logo.png', 'logo.webp', 'logo.avif'].map(async (file) => {
      const stat = await fs.stat(path.join(OUT_DIR, file));
      return { file, kb: (stat.size / 1024).toFixed(1) };
    }),
  );

  console.log('✅ Imagens otimizadas:');
  sizes.forEach(({ file, kb }) => console.log(`   ${file}: ${kb} KB`));
}

optimizeImages().catch((error) => {
  console.error('❌ Erro ao otimizar imagens:', error);
  process.exit(1);
});
