const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const FILES_TO_COPY = ['index.html', 'styles.css', 'script.js', 'CNAME', 'favicon.ico', 'mediakit.md', 'jadual.md'];
const DIRS_TO_COPY = ['assets', 'content', 'mediakit', 'jadual'];

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Clean and create dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

console.log('Building static production bundle...');

// 2. Copy files
for (const file of FILES_TO_COPY) {
  const src = path.join(__dirname, file);
  const dest = path.join(DIST_DIR, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied file: ${file}`);
  } else {
    console.warn(`✗ Warning: File not found: ${file}`);
  }
}

// 3. Copy directories
for (const dir of DIRS_TO_COPY) {
  const src = path.join(__dirname, dir);
  const dest = path.join(DIST_DIR, dir);
  if (fs.existsSync(src)) {
    copyDirSync(src, dest);
    console.log(`✓ Copied directory: ${dir}`);
  } else {
    console.warn(`✗ Warning: Directory not found: ${dir}`);
  }
}

// 4. Generate language subdirectories for path routing in production
const mainHtmlPath = path.join(DIST_DIR, 'index.html');
if (fs.existsSync(mainHtmlPath)) {
  const htmlContent = fs.readFileSync(mainHtmlPath, 'utf8');

  // Replace relative links to refer to the parent directory (../)
  const subHtmlContent = htmlContent
    .replace(/href="styles\.css"/g, 'href="../styles.css"')
    .replace(/src="script\.js"/g, 'src="../script.js"')
    .replace(/(href|src|content)="assets\//g, '$1="../assets/')
    .replace(/href="mediakit\/"/g, 'href="../mediakit/"')
    .replace(/href="jadual\/"/g, 'href="../jadual/"');


  const langMetadata = {
    ms: {
      title: 'Dr. Bryan Kek | Calon N.19 Kesidang',
      description: 'Ketahui lebih lanjut mengenai visi, latar belakang, dan usaha komuniti Dr. Bryan Kek, Calon BERSAMA untuk N.19 Kesidang. Doktor Komuniti yang berkhidmat demi rakyat.',
      url: 'https://dr.bryankek.my/ms/'
    },
    en: {
      title: 'Dr. Bryan Kek | Candidate for N.19 Kesidang',
      description: 'Learn more about the vision, background, and community services of Dr. Bryan Kek, BERSAMA Candidate for N.19 Kesidang. A Community Doctor dedicated to the people.',
      url: 'https://dr.bryankek.my/en/'
    },
    cn: {
      title: '郭杰汉医生 | N19 格西当候选人',
      description: '进一步了解 N.19 格西当州议席候选人郭杰汉医生 (Dr. Bryan Kek) 的服务愿景、社区医生背景及基层民生主张。',
      url: 'https://dr.bryankek.my/cn/'
    }
  };

  const langDirs = ['ms', 'en', 'cn'];
  for (const langDir of langDirs) {
    const meta = langMetadata[langDir];
    let langHtmlContent = subHtmlContent;

    // Replace Title tag
    langHtmlContent = langHtmlContent.replace(
      /<title>Dr\. Bryan Kek \| N19 Kesidang<\/title>/g,
      `<title>${meta.title}</title>`
    );

    // Replace general description tag
    langHtmlContent = langHtmlContent.replace(
      /content="Dr\. Bryan Kek \(郭杰汉医生\) - Calon N\.19 Kesidang \| Candidate for N\.19 Kesidang \| N\.19 格西当州议席候选人"/g,
      `content="${meta.description}"`
    );

    // Replace Open Graph metadata
    langHtmlContent = langHtmlContent.replace(
      /<meta property="og:title" content="Dr\. Bryan Kek \| N19 Kesidang">/g,
      `<meta property="og:title" content="${meta.title}">`
    );
    langHtmlContent = langHtmlContent.replace(
      /<meta property="og:description"\s+content="Dr\. Bryan Kek \(郭杰汉医生\) - Calon N\.19 Kesidang \| Candidate for N\.19 Kesidang \| N\.19 格西当州议席候选人"\s*>/g,
      `<meta property="og:description" content="${meta.description}">`
    );
    langHtmlContent = langHtmlContent.replace(
      /<meta property="og:url" content="https:\/\/dr\.bryankek\.my\/">/g,
      `<meta property="og:url" content="${meta.url}">`
    );

    // Replace Twitter Card metadata
    langHtmlContent = langHtmlContent.replace(
      /<meta name="twitter:title" content="Dr\. Bryan Kek \| N19 Kesidang">/g,
      `<meta name="twitter:title" content="${meta.title}">`
    );
    langHtmlContent = langHtmlContent.replace(
      /<meta name="twitter:description"\s+content="Dr\. Bryan Kek \(郭杰汉医生\) - Calon N\.19 Kesidang \| Candidate for N\.19 Kesidang \| N\.19 格西当州议席候选人"\s*>/g,
      `<meta name="twitter:description" content="${meta.description}">`
    );
    langHtmlContent = langHtmlContent.replace(
      /<meta name="twitter:url" content="https:\/\/dr\.bryankek\.my\/">/g,
      `<meta name="twitter:url" content="${meta.url}">`
    );

    // Update HTML lang attribute
    const htmlLang = langDir === 'cn' ? 'zh' : (langDir === 'ms' ? 'ms' : 'en');
    langHtmlContent = langHtmlContent.replace(/<html lang="en">/g, `<html lang="${htmlLang}">`);

    const targetDir = path.join(DIST_DIR, langDir);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), langHtmlContent);
    console.log(`✓ Generated routing index with localized metadata: ${langDir}/index.html`);
  }
} else {
  console.warn('✗ Warning: main index.html not found, skipping language subdirectory generation.');
}

console.log('\n🚀 Build completed successfully inside /dist!');
