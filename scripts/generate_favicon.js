const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const sourceIcon = path.join(assetsDir, 'icon.webp');
const rootIcoPath = path.join(projectRoot, 'favicon.ico');

async function generateFavicon() {
  console.log('🚀 Starting favicon generation using sharp...');

  if (!fs.existsSync(sourceIcon)) {
    console.error(`Error: Source icon not found at: ${sourceIcon}`);
    process.exit(1);
  }

  // Define target outputs in assets
  const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  // 1. Generate PNGs in assets/
  for (const target of targets) {
    const outputPath = path.join(assetsDir, target.name);
    await sharp(sourceIcon)
      .resize(target.size, target.size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${target.name} (${target.size}x${target.size})`);
  }

  // 2. Generate favicon.ico at root and inside assets/
  // We use the 32x32 PNG to build the ICO container
  const png32Buffer = await sharp(sourceIcon)
    .resize(32, 32)
    .png()
    .toBuffer();

  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: ICO
  header.writeUInt16LE(1, 4); // Count: 1 image

  // Icon Directory Entry
  header.writeUInt8(32, 6);   // Width
  header.writeUInt8(32, 7);   // Height
  header.writeUInt8(0, 8);    // Color count (0 = >= 256 colors)
  header.writeUInt8(0, 9);    // Reserved
  header.writeUInt16LE(1, 10); // Color planes
  header.writeUInt16LE(32, 12); // Bits per pixel
  header.writeUInt32LE(png32Buffer.length, 14); // Image size
  header.writeUInt32LE(22, 18); // Offset to image data

  const icoBuffer = Buffer.concat([header, png32Buffer]);

  // Write to root
  fs.writeFileSync(rootIcoPath, icoBuffer);
  console.log(`✓ Generated root favicon.ico`);

  // Write to assets/
  fs.writeFileSync(path.join(assetsDir, 'favicon.ico'), icoBuffer);
  console.log(`✓ Generated assets/favicon.ico`);

  console.log('🎉 Favicon generation completed successfully!');
}

generateFavicon().catch(err => {
  console.error('Fatal Error during favicon generation:', err);
  process.exit(1);
});
