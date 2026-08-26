// i18n Translation Dictionary for Media Kit UI
const i18n = {
  BM: {
    back_to_profile: 'Profil Utama',
    page_title: 'Kit Media',
    campaign_label: 'N.19 Kesidang',
    sec_bios: 'Biografi Rasmi',
    sec_bios_desc: 'Pilih kepanjangan biografi untuk melihat kandungan. Klik butang salin untuk menyalin biografi ke papan klip.',
    tab_short: 'Bio Ringkas (100 pp)',
    tab_medium: 'Bio Sederhana (250 pp)',
    tab_full: 'Bio Penuh (500 pp)',
    btn_copy: 'Salin Biografi',
    sec_assets: 'Gambar Rasmi',
    sec_assets_desc: 'Muat turun foto rasmi beresolusi tinggi untuk kegunaan penerbitan.',
    sec_colors: 'Identiti & Warna Kempen',
    sec_colors_desc: 'Kod warna rasmi bagi kempen pilihan raya Dr. Bryan Kek. Klik mana-mana kad warna untuk menyalin kod HEX.',
    sec_contact: 'Hubungan Media & Urusan Akhbar',
    contact_intro: 'Untuk sebarang permohonan wawancara, kenyataan akhbar, atau pertanyaan media, sila hubungi Dr. Bryan Kek secara terus:',
    download_btn: 'Muat Turun',
    msg_copied: 'Disalin ke papan klip!',
    msg_color_copied: 'Kod warna HEX disalin!',
    loading: 'Memuat turun...'
  },
  EN: {
    back_to_profile: 'Back to Profile',
    page_title: 'Media Kit',
    campaign_label: 'N.19 Kesidang',
    sec_bios: 'Official Biographies',
    sec_bios_desc: 'Select a biography length to preview. Click the copy button to copy the biography directly to your clipboard.',
    tab_short: 'Short Bio (100 words)',
    tab_medium: 'Medium Bio (250 words)',
    tab_full: 'Full Bio (500 words)',
    btn_copy: 'Copy Biography',
    sec_assets: 'Official Images',
    sec_assets_desc: 'Download high-resolution official photos for publication.',
    sec_colors: 'Brand Identity & Colors',
    sec_colors_desc: 'Official hex codes for Dr. Bryan Kek\'s Kesidang campaign materials. Click a color to copy its Hex code.',
    sec_contact: 'Media Relations & Press Contact',
    contact_intro: 'For interview requests, press statements, or media inquiries, please contact Dr. Bryan Kek directly:',
    download_btn: 'Download',
    msg_copied: 'Copied to clipboard!',
    msg_color_copied: 'HEX color code copied!',
    loading: 'Loading...'
  },
  ZH: {
    back_to_profile: '返回主页',
    page_title: '媒体包',
    campaign_label: 'N.19 格西当',
    sec_bios: '官方传记',
    sec_bios_desc: '选择不同的传记长度以预览内容。点击复制按钮可直接复制至剪贴板。',
    tab_short: '精简版传记 (100字)',
    tab_medium: '标准版传记 (250字)',
    tab_full: '详细版传记 (500字)',
    btn_copy: '复制传记',
    sec_assets: '官方照片',
    sec_assets_desc: '下载高分辨率官方照片以用于媒体报道。',
    sec_colors: '品牌标识与色彩体系',
    sec_colors_desc: '郭杰汉医生格西当竞选材料的官方颜色代码。点击色块即可复制 HEX 色彩代码。',
    sec_contact: '媒体关系与新闻联络',
    contact_intro: '如有采访申请、新闻声明或媒体咨询，请直接联系郭杰汉医生：',
    download_btn: '下载素材',
    msg_copied: '已复制到剪贴板！',
    msg_color_copied: 'HEX 颜色代码已复制！',
    loading: '加载中...'
  }
};

let currentLang = 'BM';
let parsedData = {
  EN: { title: '', subtitle: '', bios: { short: '', medium: '', full: '' } },
  BM: { title: '', subtitle: '', bios: { short: '', medium: '', full: '' } },
  ZH: { title: '', subtitle: '', bios: { short: '', medium: '', full: '' } },
  ASSETS: []
};

// 1. Language Detection & Initialization
function detectLanguage() {
  const saved = localStorage.getItem('dr_bryan_lang');
  if (saved) return saved;

  const browserLang = (navigator.language || '').toLowerCase();
  if (browserLang.startsWith('zh')) return 'ZH';
  if (browserLang.startsWith('en')) return 'EN';
  return 'BM'; // default to Malay
}

document.addEventListener('DOMContentLoaded', async () => {
  currentLang = detectLanguage();
  initLanguageSwitcher();
  initBioTabs();
  
  // Load and parse mediakit.md
  await loadMediaKitContent();
  
  // Translate UI and load corresponding language contents
  changeLanguage(currentLang);
});

// 2. Language Switcher Buttons
function initLanguageSwitcher() {
  // Lang switcher buttons are removed from UI, but we initialize currentLang from local storage or browser
  currentLang = detectLanguage();
}

function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('dr_bryan_lang', lang);
  
  // Set HTML lang attribute
  let docLang = 'ms';
  if (lang === 'ZH') docLang = 'zh';
  else if (lang === 'EN') docLang = 'en';
  document.documentElement.lang = docLang;

  // Translate static UI strings
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang] && i18n[lang][key]) {
      el.innerHTML = i18n[lang][key];
    }
  });

  // Render multi-language biographies (BM, EN, ZH)
  // Short
  const shortBM = document.getElementById('bio-short-bm');
  const shortEN = document.getElementById('bio-short-en');
  const shortZH = document.getElementById('bio-short-zh');
  if (shortBM && parsedData.BM.bios.short) shortBM.textContent = parsedData.BM.bios.short;
  if (shortEN && parsedData.EN.bios.short) shortEN.textContent = parsedData.EN.bios.short;
  if (shortZH && parsedData.ZH.bios.short) shortZH.textContent = parsedData.ZH.bios.short;

  // Medium
  const mediumBM = document.getElementById('bio-medium-bm');
  const mediumEN = document.getElementById('bio-medium-en');
  const mediumZH = document.getElementById('bio-medium-zh');
  if (mediumBM && parsedData.BM.bios.medium) mediumBM.textContent = parsedData.BM.bios.medium;
  if (mediumEN && parsedData.EN.bios.medium) mediumEN.textContent = parsedData.EN.bios.medium;
  if (mediumZH && parsedData.ZH.bios.medium) mediumZH.textContent = parsedData.ZH.bios.medium;

  // Full
  const fullBM = document.getElementById('bio-full-bm');
  const fullEN = document.getElementById('bio-full-en');
  const fullZH = document.getElementById('bio-full-zh');
  if (fullBM && parsedData.BM.bios.full) fullBM.textContent = parsedData.BM.bios.full;
  if (fullEN && parsedData.EN.bios.full) fullEN.textContent = parsedData.EN.bios.full;
  if (fullZH && parsedData.ZH.bios.full) fullZH.textContent = parsedData.ZH.bios.full;

  // Re-render assets to update download text in active language
  renderAssets(parsedData.ASSETS);
}

// 3. Tab Toggling for Bios
function initBioTabs() {
  const tabBtns = document.querySelectorAll('.bio-tab-btn');
  const panes = document.querySelectorAll('.bio-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');

      // Update button highlights
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update pane visibility
      panes.forEach(pane => {
        if (pane.id === `pane-${tabName}`) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });
}

// 4. Fetch and Parse mediakit.md
async function loadMediaKitContent() {
  try {
    const response = await fetch('../mediakit.md');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    parseMediaKitMarkdown(text);
  } catch (error) {
    console.error('Failed to load media kit markdown configuration:', error);
    // Display error message in UI
    const container = document.getElementById('assets-grid-container');
    if (container) {
      container.innerHTML = `<p class="loading-placeholder" style="color: #ff0000;">Gagal memuat turun data kit media. Sila pastikan fail mediakit.md wujud.</p>`;
    }
  }
}

function parseMediaKitMarkdown(text) {
  // Normalize line endings
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split into top-level heading sections: EN, BM, ZH, ASSETS
  const sections = text.split(/\n#\s+/);
  
  for (let section of sections) {
    section = section.trim();
    if (!section) continue;

    // If the section doesn't start with a header because it's the very first part of the document
    if (sections[0] === section && !text.startsWith('#')) {
      continue;
    }
    
    const lines = section.split('\n');
    let header = lines[0].trim().toUpperCase();
    if (header.startsWith('#')) {
      header = header.replace(/^#\s*/, '').trim();
    }
    const content = lines.slice(1).join('\n');

    if (header === 'EN' || header === 'BM' || header === 'ZH') {
      parsedData[header] = parseLanguageSection(content);
    } else if (header === 'ASSETS') {
      parsedData.ASSETS = parseAssetsSection(content);
    }
  }
}

function parseLanguageSection(contentString) {
  const data = {
    title: '',
    subtitle: '',
    bios: {
      short: '',
      medium: '',
      full: ''
    }
  };
  
  const lines = contentString.split('\n');
  let currentKey = null;
  let currentText = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('## Title')) {
      commitCurrent();
      currentKey = 'title';
      currentText = [];
    } else if (trimmed.startsWith('## Subtitle')) {
      commitCurrent();
      currentKey = 'subtitle';
      currentText = [];
    } else if (trimmed.startsWith('### Short Bio')) {
      commitCurrent();
      currentKey = 'bio_short';
      currentText = [];
    } else if (trimmed.startsWith('### Medium Bio')) {
      commitCurrent();
      currentKey = 'bio_medium';
      currentText = [];
    } else if (trimmed.startsWith('### Full Bio')) {
      commitCurrent();
      currentKey = 'bio_full';
      currentText = [];
    } else if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      commitCurrent();
      currentKey = null;
    } else if (currentKey) {
      currentText.push(line);
    }
  }
  commitCurrent();
  
  function commitCurrent() {
    if (!currentKey) return;
    const joined = currentText.join('\n').trim();
    if (currentKey === 'title') data.title = joined;
    else if (currentKey === 'subtitle') data.subtitle = joined;
    else if (currentKey === 'bio_short') data.bios.short = joined;
    else if (currentKey === 'bio_medium') data.bios.medium = joined;
    else if (currentKey === 'bio_full') data.bios.full = joined;
  }
  
  return data;
}

function parseAssetsSection(contentString) {
  const assets = [];
  const lines = contentString.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('-')) continue;
    
    // Match: - [Title](url) - Description
    const match = trimmed.match(/^\s*-\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:-\s*)?(.*)$/);
    if (match) {
      assets.push({
        title: match[1].trim(),
        url: match[2].trim(),
        description: match[3] ? match[3].trim() : ''
      });
    }
  }
  return assets;
}

// 5. Asset URL Resolver
function resolveAssetUrl(url) {
  if (url.startsWith('/')) {
    return '..' + url;
  }
  if (url.startsWith('assets/')) {
    return '../' + url;
  }
  return url;
}

// 6. Render Assets to DOM
function renderAssets(assetsList) {
  const container = document.getElementById('assets-grid-container');
  if (!container) return;
  
  if (assetsList.length === 0) {
    container.innerHTML = `<p class="loading-placeholder">Tiada aset ditemui dalam mediakit.md.</p>`;
    return;
  }
  
  let html = '';
  for (const asset of assetsList) {
    const resolvedUrl = resolveAssetUrl(asset.url);
    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(asset.url);
    const fileExt = asset.url.split('.').pop().toLowerCase();
    
    let previewHtml = '';
    if (isImage) {
      previewHtml = `<img src="${resolvedUrl}" alt="${asset.title}" class="asset-img-preview" onerror="this.onerror=null; this.parentNode.innerHTML='<div class=\\'asset-icon-preview\\'><svg width=\\'48\\' height=\\'48\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'1.5\\'><rect x=\\'3\\' y=\\'3\\' width=\\'18\\' height=\\'18\\' rx=\\'2\\' ry=\\'2\\'></rect><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'></circle><polyline points=\\'21 15 16 10 5 21\\'></polyline></svg><span class=\\'asset-file-tag\\'>${fileExt}</span></div>';">`;
    } else {
      previewHtml = `
        <div class="asset-icon-preview">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span class="asset-file-tag">${fileExt}</span>
        </div>`;
    }
    
    const dlText = i18n[currentLang].download_btn;
    
    html += `
      <div class="asset-card">
        <div class="asset-preview-box">
          ${previewHtml}
        </div>
        <div class="asset-info">
          <h4 class="asset-title">${asset.title}</h4>
          <p class="asset-desc">${asset.description}</p>
        </div>
        <a href="${resolvedUrl}" download="${asset.title}.${fileExt}" class="asset-download-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>${dlText}</span>
        </a>
      </div>`;
  }
  container.innerHTML = html;
}

// 7. Clipboard copy actions
window.copyBio = function(tabName, lang) {
  const textElement = document.getElementById(`bio-${tabName}-${lang.toLowerCase()}`);
  if (!textElement) return;

  navigator.clipboard.writeText(textElement.textContent).then(() => {
    showToast(i18n[currentLang].msg_copied);
  }).catch(err => {
    console.error('Could not copy bio: ', err);
  });
};

window.copyColor = function(hex) {
  navigator.clipboard.writeText(hex).then(() => {
    showToast(i18n[currentLang].msg_color_copied);
  }).catch(err => {
    console.error('Could not copy color HEX code: ', err);
  });
};

// 8. Toast Helper
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}
