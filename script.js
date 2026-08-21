// Calculate base URL for assets and content dynamically
const basePath = window.location.pathname.match(/^\/(ms|en|cn)(\/|$)/) ? '../' : './';

let currentLang = 'BM'; // Default is Malay (BM)
let currentGeneral = {};
const contentCache = {};

// Resolve initial language from path, localStorage, browser, or default
function detectInitialLanguage() {
  const path = window.location.pathname;
  if (path.startsWith('/ms')) return 'BM';
  if (path.startsWith('/en')) return 'EN';
  if (path.startsWith('/cn')) return 'ZH';
  
  const saved = localStorage.getItem('dr_bryan_lang');
  if (saved) return saved;

  const browserLang = (navigator.language || '').toLowerCase();
  if (browserLang.startsWith('zh')) return 'ZH';
  if (browserLang.startsWith('en')) return 'EN';
  return 'BM'; // default
}

currentLang = detectInitialLanguage();

// Redirect to language subpath if at the root path
const initialPath = window.location.pathname;
if (initialPath === '/' || initialPath === '/index.html') {
  const targetPath = currentLang === 'EN' ? '/en/' : (currentLang === 'ZH' ? '/cn/' : '/ms/');
  window.location.replace(targetPath);
}

// Initialize Elements & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initAccordions();
  initMobileStickyHeader();
  
  // Set default translations and load content
  changeLanguage(currentLang);
});

// 1. Language Switcher
function initLanguageSwitcher() {
  const langButtons = document.querySelectorAll('.lang-btn');
  
  // Update active state initially
  updateUIActiveState(currentLang);

  // Setup click listeners for main buttons
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedLang = e.currentTarget.getAttribute('data-lang');
      if (selectedLang) {
        currentLang = selectedLang;
        changeLanguage(currentLang);
      }
    });
  });
}

function updateUIActiveState(lang) {
  const langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

async function fetchOverrideFile(path) {
  try {
    const res = await fetch(path);
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {
    // Ignore and return null if file does not exist
  }
  return null;
}

// 2. Fetch and Parse Multilingual Content from Markdown Files
async function fetchLanguageContent(lang) {
  if (contentCache[lang]) {
    return contentCache[lang];
  }

  try {
    // 1. Fetch baseline English content
    const [generalRes, speechRes, cvRes] = await Promise.all([
      fetch(basePath + 'content/EN/general.md'),
      fetch(basePath + 'content/EN/speech.md'),
      fetch(basePath + 'content/EN/cv.md')
    ]);

    const [generalText, speechText, cvText] = await Promise.all([
      generalRes.text(),
      speechRes.text(),
      cvRes.text()
    ]);

    let finalGeneral = parseGeneral(generalText);
    let finalSpeech = speechText;
    let finalCv = cvText;

    let overriddenGeneral = false;
    let overriddenSpeech = false;
    let overriddenCv = false;
    let generalKeys = [];

    // 2. Overwrite with specific language overrides if lang is not EN
    if (lang !== 'EN') {
      const [overrideGeneral, overrideSpeech, overrideCv] = await Promise.all([
        fetchOverrideFile(basePath + `content/${lang}/general.md`),
        fetchOverrideFile(basePath + `content/${lang}/speech.md`),
        fetchOverrideFile(basePath + `content/${lang}/cv.md`)
      ]);

      if (overrideGeneral) {
        const parsedOverride = parseGeneral(overrideGeneral);
        generalKeys = Object.keys(parsedOverride);
        Object.assign(finalGeneral, parsedOverride);
        overriddenGeneral = true;
      }
      if (overrideSpeech) {
        finalSpeech = overrideSpeech;
        overriddenSpeech = true;
      }

      if (overrideCv) {
        finalCv = overrideCv;
        overriddenCv = true;
      }
    }

    contentCache[lang] = {
      general: finalGeneral,
      speech: parseSpeech(finalSpeech),
      cv: parseCV(finalCv),
      overridden: {
        general: overriddenGeneral,
        speech: overriddenSpeech,
        cv: overriddenCv,
        generalKeys: generalKeys
      }
    };

    return contentCache[lang];
  } catch (error) {
    console.error('Failed to load content for language: ' + lang, error);
    return null;
  }
}

// Parsing key: value lines
function parseGeneral(text) {
  const result = {};
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (match) {
      result[match[1]] = match[2].trim();
    }
  }
  return result;
}

// Parsing paragraphs & blockquotes (>) for speech
function parseSpeech(text) {
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const paragraphs = text.split(/\n\n+/);
  let html = '<div class="speech-container">';
  
  for (let p of paragraphs) {
    p = p.trim();
    if (!p) continue;
    
    // Support markdown bold syntax (**text**)
    p = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Check if it is a blockquote/poem (starts with >)
    if (p.startsWith('>')) {
      const lines = p.split('\n').map(line => line.replace(/^>\s*/, '').trim());
      html += `<div class="poem-block">${lines.join('<br>')}</div>`;
    } else {
      // Regular paragraph (checks for concluding line)
      if (p.includes('Bersama-samalah') || p.includes('Join me') || p.includes('让我们携手') || p.includes('ஒரு சிறந்த')) {
        html += `<p class="speech-paragraph" style="font-weight: 600; text-align: center;">${p.replace(/\n/g, '<br>')}</p>`;
      } else {
        html += `<p class="speech-paragraph">${p.replace(/\n/g, '<br>')}</p>`;
      }
    }
  }
  html += '</div>';
  return html;
}



// Parsing horizontal rule (---) divided sections for timeline
function parseCV(text) {
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const items = text.split(/\n---\n+/);
  let html = '<div class="timeline">';
  
  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    
    let period = '';
    let role = '';
    let org = '';
    let desc = '';
    
    const lines = trimmed.split('\n');
    let isEdu = false;
    
    for (let line of lines) {
      line = line.trim();
      if (!line) continue;
      
      if (line.startsWith('## ')) {
        period = line.replace('## ', '').trim();
      } else if (line.startsWith('### ')) {
        role = line.replace('### ', '').trim();
        // Check if degree/education
        const roleLower = role.toLowerCase();
        if (
          roleLower.includes('master') || 
          roleLower.includes('doctor') || 
          roleLower.includes('sarjana') || 
          roleLower.includes('doktor perubatan') || 
          roleLower.includes('மருத்துவ') || 
          roleLower.includes('முதுகலை') || 
          roleLower.includes('医学士') || 
          roleLower.includes('硕士')
        ) {
          isEdu = true;
        }
      } else if (line.startsWith('**') && line.endsWith('**')) {
        org = line.slice(2, -2).trim();
      } else {
        desc = line;
      }
    }
    
    const markerClass = isEdu ? 'timeline-item education' : 'timeline-item';
    html += `
      <div class="${markerClass}">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <span class="timeline-date">${period}</span>
          <h3 class="timeline-role">${role}</h3>
          <h4 class="timeline-org">${org}</h4>
          <p class="timeline-desc">${desc}</p>
        </div>
      </div>`;
  }
  
  html += '</div>';
  return html;
}

// Apply translations dynamically to DOM
async function changeLanguage(lang) {
  localStorage.setItem('dr_bryan_lang', lang);
  
  // Redirect to the appropriate subdirectory if pathname doesn't match
  const targetPath = lang === 'EN' ? '/en/' : (lang === 'ZH' ? '/cn/' : '/ms/');
  const currentPath = window.location.pathname;
  if (currentPath !== targetPath && currentPath !== targetPath.slice(0, -1)) {
    window.location.href = targetPath;
    return;
  }
  
  // Update document language tag appropriately
  let docLang = 'en';
  if (lang === 'ZH') docLang = 'zh';
  else if (lang === 'TA') docLang = 'ta';
  else if (lang === 'BM') docLang = 'ms';
  else if (lang !== 'EN') docLang = lang;
  document.documentElement.lang = docLang;
  
  // Fetch parsed content (English base + optional overrides merged)
  const data = await fetchLanguageContent(lang);
  if (!data) return;

  currentGeneral = data.general;

  // Render general text keys
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    
    if (key === 'speech_title') {
      el.textContent = currentGeneral.speech_title || 'Background & Vision';
      if (data.overridden && data.overridden.general) {
        el.classList.add('notranslate');
      } else {
        el.classList.remove('notranslate');
      }
    } else if (key === 'speech_content') {
      // Handled separately below
    } else if (currentGeneral[key]) {
      el.innerHTML = currentGeneral[key];
      // Mark as notranslate if this specific general key is overridden
      if (data.overridden && data.overridden.generalKeys && data.overridden.generalKeys.includes(key)) {
        el.classList.add('notranslate');
      } else {
        el.classList.remove('notranslate');
      }
    }
  });

  // Render placeholders
  const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
  placeholders.forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (currentGeneral[key]) {
      el.setAttribute('placeholder', currentGeneral[key]);
    }
  });



  const cvContainer = document.getElementById('cv-container');
  if (cvContainer) {
    cvContainer.innerHTML = data.cv;
    if (data.overridden && data.overridden.cv) {
      cvContainer.classList.add('notranslate');
    } else {
      cvContainer.classList.remove('notranslate');
    }
  }

  const speechContentBox = document.getElementById('speech-content-box');
  if (speechContentBox) {
    speechContentBox.innerHTML = data.speech;
    if (data.overridden && data.overridden.speech) {
      speechContentBox.classList.add('notranslate');
    } else {
      speechContentBox.classList.remove('notranslate');
    }
  }

  // Update UI language switcher highlight state
  updateUIActiveState(lang);
}

// 3. Custom Toast Notification
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
  
  // Remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, 3000);
}

// 4. Copy Link to Clipboard
function copyProfileLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast(currentGeneral.msg_link_copied || "Link copied!");
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// 4.1 Social Sharing Logic
function shareProfile() {
  const trilingualInfo = "Dr. Bryan Kek (郭杰汉医生) - Calon N.19 Kesidang | Candidate for N.19 Kesidang | N.19 格西当州议席候选人";
  const shareData = {
    title: "Dr. Bryan Kek",
    text: trilingualInfo,
    url: window.location.href
  };

  // If Native Share API is supported and not in an iframe, use it
  if (navigator.share && window.self === window.top) {
    navigator.share(shareData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          fallbackShare();
        }
      });
  } else {
    fallbackShare();
  }
}

function fallbackShare() {
  const currentUrl = encodeURIComponent(window.location.href);
  const trilingualInfo = "Dr. Bryan Kek (郭杰汉医生) - Calon N.19 Kesidang | Candidate for N.19 Kesidang | N.19 格西当州议席候选人";
  const shareText = encodeURIComponent(`${trilingualInfo}\n\n`);

  // Update Sharing Links
  const whatsappEl = document.getElementById('share-whatsapp');
  const telegramEl = document.getElementById('share-telegram');
  const facebookEl = document.getElementById('share-facebook');
  const twitterEl = document.getElementById('share-twitter');
  const linkedinEl = document.getElementById('share-linkedin');
  const previewLinkEl = document.getElementById('share-preview-link');

  if (whatsappEl) whatsappEl.href = `https://api.whatsapp.com/send?text=${shareText}${currentUrl}`;
  if (telegramEl) telegramEl.href = `https://t.me/share/url?url=${currentUrl}&text=${shareText}`;
  if (facebookEl) facebookEl.href = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
  if (twitterEl) twitterEl.href = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`;
  if (linkedinEl) linkedinEl.href = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
  if (previewLinkEl) previewLinkEl.href = `https://www.opengraph.xyz/url/${currentUrl}`;

  // Open the Modal overlay
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closeShareModal() {
  const modal = document.getElementById('share-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function handleOutsideClick(event) {
  const modalContent = document.querySelector('.modal-content');
  if (modalContent && !modalContent.contains(event.target)) {
    closeShareModal();
  }
}

function copyToClipboardFromModal() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast(currentGeneral.msg_link_copied || "Link copied!");
    closeShareModal();
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// 5. Download Contact (vCard)
function downloadVCard() {
  const fn = currentGeneral.vcard_fn || "Dr. Bryan Kek";
  const org = currentGeneral.vcard_org || "Sinar Community Mobile Clinic";
  const title = currentGeneral.vcard_title || "Public Health Practitioner & Civic Advocate";
  const tel = currentGeneral.vcard_tel || "+60168804697";
  const email = currentGeneral.vcard_email || "contact@drbryankek.my";
  const url = currentGeneral.vcard_url || "https://dr.bryankek.my";

  const nameParts = fn.split(' ');
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const firstName = nameParts.length > 0 ? nameParts.slice(0, -1).join(' ') : fn;

  const vcard = `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
FN:${fn}
ORG:${org}
TITLE:${title}
TEL;TYPE=CELL,VOICE:${tel}
EMAIL;TYPE=PREF,INTERNET:${email}
URL:${url}
REV:${new Date().toISOString()}
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', `${fn.replace(/[^a-zA-Z0-9]/g, '_')}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast(currentGeneral.contact_saved_msg || "Contact saved!");
}



// 7. Accordions Logic
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      const arrow = header.querySelector('.accordion-arrow');
      
      if (!targetContent) return;
      
      const isExpanded = header.classList.contains('active');
      
      // Close other accordions
      document.querySelectorAll('.accordion-header').forEach(h => {
        if (h !== header) {
          h.classList.remove('active');
          const otherContent = document.getElementById(h.getAttribute('data-target'));
          if (otherContent) {
            otherContent.style.maxHeight = null;
            otherContent.classList.remove('open');
          }
          const otherArrow = h.querySelector('.accordion-arrow');
          if (otherArrow) otherArrow.style.transform = 'rotate(0deg)';
        }
      });
      
      if (isExpanded) {
        header.classList.remove('active');
        targetContent.style.maxHeight = null;
        targetContent.classList.remove('open');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
      } else {
        header.classList.add('active');
        targetContent.classList.add('open');
        targetContent.style.maxHeight = targetContent.scrollHeight + "px";
        if (arrow) arrow.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
          header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    });
  });
}

// 8. Sticky Mini-Header Scroll Listener (All Viewports)
function initMobileStickyHeader() {
  const miniHeader = document.getElementById('mobile-sticky-header');
  if (!miniHeader) return;

  window.addEventListener('scroll', () => {
    // Show when scroll position is greater than 350px (past the avatar/hero card)
    if (window.scrollY > 350) {
      miniHeader.classList.add('show');
    } else {
      miniHeader.classList.remove('show');
    }
  });
}
