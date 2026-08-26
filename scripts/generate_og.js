const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

// Set up absolute paths relative to this script
const projectRoot = path.join(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const avatarPath = path.join(assetsDir, 'dr_bryan_kek.jpg');
const logoPath = path.join(assetsDir, 'logo.webp');

const outputLandscape = path.join(assetsDir, 'og_preview_landscape.webp');
const outputSquare = path.join(assetsDir, 'og_preview_square.webp');

// Helper to check if file exists
function checkExists(filePath, name) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: Required file "${name}" not found at: ${filePath}`);
    process.exit(1);
  }
}

// Rounded rect drawing helper
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function run() {
  console.log('🚀 Starting programmatic Open Graph preview generator via canvas...');
  
  checkExists(avatarPath, 'Avatar image (dr_bryan_kek.jpg)');
  checkExists(logoPath, 'Logo image (logo.webp)');

  // Load resources
  const avatar = await loadImage(avatarPath);
  const logo = await loadImage(logoPath);
  const logoAspectRatio = logo.width / logo.height;

  // 1. Generate Landscape Preview (1200x630)
  console.log('🎨 Drawing landscape OG preview (1200x630)...');
  const canvasL = createCanvas(1200, 630);
  const ctxL = canvasL.getContext('2d');

  // Solid yellow base
  ctxL.fillStyle = '#eebd00';
  ctxL.fillRect(0, 0, 1200, 630);

  // Background Blobs (standard Canvas blur filter)
  ctxL.save();
  ctxL.filter = 'blur(95px)';
  
  ctxL.fillStyle = '#e8a838';
  ctxL.globalAlpha = 0.35;
  ctxL.beginPath();
  ctxL.arc(1100, -50, 350, 0, Math.PI * 2);
  ctxL.fill();

  ctxL.fillStyle = '#3e38e8';
  ctxL.globalAlpha = 0.18;
  ctxL.beginPath();
  ctxL.arc(150, 650, 300, 0, Math.PI * 2);
  ctxL.fill();
  ctxL.restore();

  // Glass Card Container (elegant padding framing)
  ctxL.save();
  ctxL.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctxL.strokeStyle = 'rgba(32, 32, 112, 0.08)';
  ctxL.lineWidth = 1;
  roundedRect(ctxL, 40, 40, 1120, 550, 28);
  ctxL.fill();
  ctxL.stroke();
  ctxL.restore();

  // Draw Avatar inside circular clip on the Left (centered vertically at cy=315, diameter 320px)
  ctxL.save();
  ctxL.beginPath();
  ctxL.arc(240, 315, 160, 0, Math.PI * 2);
  ctxL.clip();
  ctxL.drawImage(avatar, 80, 155, 320, 320);
  ctxL.restore();

  // Avatar white outer ring
  ctxL.strokeStyle = '#ffffff';
  ctxL.lineWidth = 4;
  ctxL.beginPath();
  ctxL.arc(240, 315, 160, 0, Math.PI * 2);
  ctxL.stroke();

  // RIGHT COLUMN: All elements left-aligned at x=460
  // Draw BERSAMA logo inside card (height enlarged to 72px, top=100px)
  const logoWidthL = 72 * logoAspectRatio;
  ctxL.drawImage(logo, 460, 100, logoWidthL, 72);

  // Name (maximized to 64px, baseline at y=255)
  ctxL.fillStyle = '#202070';
  ctxL.font = '900 64px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxL.textAlign = 'left';
  ctxL.textBaseline = 'alphabetic';
  ctxL.fillText('Dr. Bryan Kek', 460, 255);

  // Draw Trilingual Badges side-by-side in a single row (y=305, height 36px)
  ctxL.fillStyle = 'rgba(32, 32, 112, 0.06)';
  ctxL.font = '900 13px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxL.textAlign = 'center';
  ctxL.textBaseline = 'middle';

  // Badge 1: Chinese (N.19 格西当候选人)
  roundedRect(ctxL, 460, 305, 170, 36, 18);
  ctxL.fill();
  ctxL.fillStyle = '#202070';
  ctxL.fillText('N.19 格西当候选人', 545, 323);

  // Badge 2: English (Candidate for N.19 Kesidang)
  ctxL.fillStyle = 'rgba(32, 32, 112, 0.06)';
  roundedRect(ctxL, 645, 305, 260, 36, 18);
  ctxL.fill();
  ctxL.fillStyle = '#202070';
  ctxL.fillText('Candidate for N.19 Kesidang', 775, 323);

  // Badge 3: Malay (Calon N.19 Kesidang)
  ctxL.fillStyle = 'rgba(32, 32, 112, 0.06)';
  roundedRect(ctxL, 920, 305, 180, 36, 18);
  ctxL.fill();
  ctxL.fillStyle = '#202070';
  ctxL.fillText('Calon N.19 Kesidang', 1010, 323);

  // Trilingual Taglines stacked (left-aligned at x=460)
  ctxL.textAlign = 'left';

  // Chinese Title
  ctxL.fillStyle = '#2a2a7a';
  ctxL.font = '600 24px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxL.fillText('社区医生与公民倡导者', 460, 405);

  // English & Malay Titles (split into two distinct clean lines)
  ctxL.font = '600 18px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxL.fillText('Community Doctor & Civic Advocate', 460, 450);
  ctxL.fillText('Doktor Komuniti & Pejuang Sivik', 460, 490);

  // Save landscape
  const bufferL = await canvasL.toBuffer('image/webp', 90);
  fs.writeFileSync(outputLandscape, bufferL);
  console.log(`✓ Saved landscape preview: ${outputLandscape}`);


  // 2. Generate Square Preview (1080x1080)
  console.log('🎨 Drawing square OG preview (1080x1080)...');
  const canvasS = createCanvas(1080, 1080);
  const ctxS = canvasS.getContext('2d');

  // Solid yellow base
  ctxS.fillStyle = '#eebd00';
  ctxS.fillRect(0, 0, 1080, 1080);

  // Background Blobs
  ctxS.save();
  ctxS.filter = 'blur(95px)';
  
  ctxS.fillStyle = '#e8a838';
  ctxS.globalAlpha = 0.35;
  ctxS.beginPath();
  ctxS.arc(980, 100, 450, 0, Math.PI * 2);
  ctxS.fill();

  ctxS.fillStyle = '#3e38e8';
  ctxS.globalAlpha = 0.18;
  ctxS.beginPath();
  ctxS.arc(100, 980, 400, 0, Math.PI * 2);
  ctxS.fill();
  ctxS.restore();

  // Glass Card (padding 40px for elegant framing)
  ctxS.save();
  ctxS.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctxS.strokeStyle = 'rgba(32, 32, 112, 0.08)';
  ctxS.lineWidth = 1;
  roundedRect(ctxS, 40, 40, 1000, 1000, 36);
  ctxS.fill();
  ctxS.stroke();
  ctxS.restore();

  // BERSAMA logo (centered, height enlarged to 88px, top=90px)
  const logoWidthS = 88 * logoAspectRatio;
  ctxS.drawImage(logo, 540 - logoWidthS / 2, 90, logoWidthS, 88);

  // Circular Avatar (centered, enlarged to 320px diameter, top is 210px, bottom is 530px)
  ctxS.save();
  ctxS.beginPath();
  ctxS.arc(540, 370, 160, 0, Math.PI * 2);
  ctxS.clip();
  ctxS.drawImage(avatar, 380, 210, 320, 320);
  ctxS.restore();

  ctxS.strokeStyle = '#ffffff';
  ctxS.lineWidth = 4;
  ctxS.beginPath();
  ctxS.arc(540, 370, 160, 0, Math.PI * 2);
  ctxS.stroke();

  // Candidate Badge (centered, unified trilingual badge, enlarged to height 54px, font 20px)
  ctxS.fillStyle = 'rgba(32, 32, 112, 0.06)';
  roundedRect(ctxS, 240, 550, 600, 54, 27);
  ctxS.fill();

  ctxS.fillStyle = '#202070';
  ctxS.font = '900 20px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxS.textAlign = 'center';
  ctxS.textBaseline = 'middle';
  ctxS.fillText('Calon N.19 Kesidang  •  Candidate  •  候选人', 540, 577);

  // Name (centered, aligned at y=715, occupies y=643 to 715)
  ctxS.fillStyle = '#202070';
  ctxS.font = '900 72px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxS.fillText('Dr. Bryan Kek', 540, 715);

  // Trilingual Taglines stacked
  // Chinese Title
  ctxS.fillStyle = '#2a2a7a';
  ctxS.font = '600 28px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxS.fillText('社区医生与公民倡导者', 540, 770);

  // English & Malay Titles
  ctxS.fillStyle = '#2a2a7a';
  ctxS.font = '600 20px "Microsoft YaHei", "Segoe UI", Arial, sans-serif';
  ctxS.fillText('Community Doctor & Civic Advocate', 540, 815);
  ctxS.fillText('Doktor Komuniti & Pejuang Sivik', 540, 860);

  // Save square
  const bufferS = await canvasS.toBuffer('image/webp', 90);
  fs.writeFileSync(outputSquare, bufferS);
  console.log(`✓ Saved square preview: ${outputSquare}`);
  console.log('🎉 Programmatic OG preview image generation completed successfully!');
}

run().catch(err => {
  console.error('Fatal Error during image generation:', err);
});
