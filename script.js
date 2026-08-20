// Calculate base URL for assets and content dynamically
const basePath = window.location.pathname.match(/^\/(ms|en|cn)(\/|$)/) ? '../' : './';

let currentLang = 'BM'; // Default is Malay (BM)
let currentGeneral = {};
const contentCache = {};

function getGoogtransLanguage() {
  const name = 'googtrans';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const val = parts.pop().split(';').shift();
    return val.split('/').pop();
  }
  return null;
}

function mapGoogtransToLangKey(googCode) {
  if (googCode === 'ms') return 'BM';
  if (googCode === 'zh-CN') return 'ZH';
  if (googCode === 'en') return 'EN';
  return googCode; // custom language code
}

// Resolve initial language from path, cookie, localStorage, or default
function detectInitialLanguage() {
  const path = window.location.pathname;
  if (path.startsWith('/ms')) return 'BM';
  if (path.startsWith('/en')) return 'EN';
  if (path.startsWith('/cn')) return 'ZH';
  
  const cookieLang = getGoogtransLanguage();
  if (cookieLang) {
    return mapGoogtransToLangKey(cookieLang);
  }
  return localStorage.getItem('dr_bryan_lang') || 'BM';
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
  const moreLangsSelect = document.getElementById('more-langs');
  const switcher = document.querySelector('.lang-switcher-pill');
  
  // Update active state initially
  updateUIActiveState(currentLang);

  // Setup click listeners for main buttons
  langButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedLang = e.currentTarget.getAttribute('data-lang');
      if (selectedLang) {
        currentLang = selectedLang;
        changeLanguage(currentLang);
        if (switcher) switcher.classList.remove('expanded');
      }
    });
  });

  // Setup change listener for dropdown
  if (moreLangsSelect) {
    moreLangsSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      if (selectedLang) {
        currentLang = selectedLang;
        changeLanguage(currentLang);
        if (switcher) switcher.classList.remove('expanded');
      }
    });
  }

  // Handle collapsible switcher on mobile
  if (switcher) {
    switcher.addEventListener('click', (e) => {
      // If clicking inside the select or on an inactive button, let it select
      const select = e.target.closest('select');
      const inactiveBtn = e.target.closest('.lang-btn:not(.active)');
      
      if (select || inactiveBtn) {
        return;
      }
      
      switcher.classList.toggle('expanded');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!switcher.contains(e.target)) {
        switcher.classList.remove('expanded');
      }
    });
  }

  // Populate dynamic dropdown languages from Google Translate once ready
  const nativeLanguageMap = {
    'af': 'Afrikaans', 'sq': 'Shqip', 'am': 'አማርኛ', 'ar': 'العربية', 'hy': 'Հայերեն', 'as': 'অসমীয়া', 'ay': 'Aymar', 'az': 'Azərbaycan dili', 'bm': 'Bamanankan', 'eu': 'Euskara', 'be': 'Беларуская', 'bn': 'বাংলা', 'bho': 'भোজपुरी', 'bs': 'Bosanski', 'bg': 'Български', 'ca': 'Català', 'ceb': 'Cebuano', 'ny': 'Chichewa', 'zh-CN': '中文 (简体)', 'zh-TW': '中文 (繁體)', 'co': 'Corsu', 'hr': 'Hrvatski', 'cs': 'Čeština', 'da': 'Dansk', 'dv': 'ދިވެހި', 'doi': 'डोगरी', 'nl': 'Nederlands', 'en': 'English', 'eo': 'Esperanto', 'et': 'Eesti', 'ee': 'Eʋegbe', 'tl': 'Tagalog', 'fil': 'Tagalog', 'fi': 'Suomi', 'fr': 'Français', 'fy': 'Frysk', 'gl': 'Galego', 'ka': 'ქართული', 'de': 'Deutsch', 'el': 'Ελληνικά', 'gn': 'Guarani', 'gu': 'ગુજરાતી', 'ht': 'Kreyòl ayisyen', 'ha': 'Hausa', 'haw': 'ʻŌlelo Hawaiʻi', 'iw': 'עברית', 'he': 'עברית', 'hi': 'हिन्दी', 'hmn': 'Hmong', 'hu': 'Magyar', 'is': 'Íslenska', 'ig': 'Igbo', 'ilo': 'Ilokano', 'id': 'Bahasa Indonesia', 'ga': 'Gaeilge', 'it': 'Italiano', 'ja': '日本語', 'jw': 'Basa Jawa', 'jv': 'Basa Jawa', 'kn': 'ಕನ್ನಡ', 'kk': 'Қазақ тілі', 'km': 'ខ្មែរ', 'rw': 'Kinyarwanda', 'ko': '한국어', 'ko-KP:': '조선말', 'kri': 'Krio', 'ku': 'Kurdî', 'ckb': 'کوردی (سۆرانی)', 'ky': 'Кыргызча', 'lo': 'ລາວ', 'la': 'Latina', 'lv': 'Latviešu', 'lt': 'Lietuvių', 'lg': 'Luganda', 'lb': 'Lëtzebuergesch', 'mk': 'Македонски', 'mg': 'Malagasy', 'ms': 'Bahasa Melayu', 'ml': 'മലയാളം', 'mt': 'Malti', 'mi': 'Te Reo Māori', 'mr': 'மராठी', 'mni-Mtei': 'মৈতৈলোন্', 'lus': 'Mizo', 'mn': 'Монгол', 'my': 'မြန်မာ', 'ne': 'नेपाली', 'no': 'Norsk', 'or': 'ଓଡ଼ିଆ', 'om': 'Afaan Oromoo', 'ps': 'پښتو', 'fa': 'فارسی', 'pl': 'Polski', 'pt': 'Português', 'pa': 'ਪੰਜਾਬੀ', 'qu': 'Runa Simi', 'ro': 'Română', 'ru': 'Русский', 'sm': 'Gagana Samoa', 'sa': 'संस्कृतम्', 'gd': 'Gàidhlig', 'nso': 'Sepedi', 'sr': 'Српски', 'st': 'Sesotho', 'sn': 'ChiShona', 'sd': 'سنڌي', 'si': 'සිංහල', 'sk:': 'Slovenčina', 'sl': 'Slovenščina', 'so': 'Soomaali', 'es': 'Español', 'su': 'Basa Sunda', 'sw': 'Kiswahili', 'sv': 'Svenska', 'tg': 'Тоҷикӣ', 'ta': 'தமிழ்', 'tt': 'Tatar', 'te': 'తెలుగు', 'th': 'ไทย', 'ti': 'ትግርኛ', 'ts': 'Xitsonga', 'tr': 'Türkçe', 'tk': 'Türkmen dili', 'ak': 'Twi', 'uk': 'Українська', 'ur': 'اردو', 'ug': 'ئۇيغۇرچە', 'uz': 'Oʻzbekcha', 'vi': 'Tiếng Việt', 'cy': 'Cymraeg', 'xh': 'isiXhosa', 'yi': 'ייִדיש', 'yo': 'Yorùbá', 'zu': 'isiZulu'
  };

  const priorityCodes = ['ms', 'zh-CN', 'ta', 'ja', 'ko', 'de', 'fr', 'es', 'it', 'ar', 'id'];

  const fetchInterval = setInterval(() => {
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect && googleSelect.options.length > 20) {
      clearInterval(fetchInterval);

      const options = Array.from(googleSelect.options)
        .filter(opt => opt.value !== '')
        .map(opt => ({
          value: opt.value,
          text: nativeLanguageMap[opt.value] || opt.text
        }));

      // Exclude main shortcut languages to avoid redundancy
      const filteredOptions = options.filter(opt => !['en', 'ms', 'zh-CN'].includes(opt.value));

      const topLangs = priorityCodes
        .map(code => filteredOptions.find(l => l.value === code))
        .filter(Boolean);
      const otherLangs = filteredOptions.filter(l => !priorityCodes.includes(l.value));

      if (moreLangsSelect) {
        moreLangsSelect.innerHTML = '<option value="" disabled selected>🌐 More</option>';

        if (topLangs.length > 0) {
          const topGroup = document.createElement('optgroup');
          topGroup.label = 'Frequently Used';
          topLangs.forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang.value;
            opt.textContent = lang.text;
            topGroup.appendChild(opt);
          });
          moreLangsSelect.appendChild(topGroup);
        }

        if (otherLangs.length > 0) {
          const otherGroup = document.createElement('optgroup');
          otherGroup.label = 'All Languages';
          otherLangs.forEach(lang => {
            const opt = document.createElement('option');
            opt.value = lang.value;
            opt.textContent = lang.text;
            otherGroup.appendChild(opt);
          });
          moreLangsSelect.appendChild(otherGroup);
        }

        // Restore value in select dropdown if active language is one of the options
        const currentCookieVal = getGoogtransLanguage();
        if (currentCookieVal && !['en', 'ms', 'zh-CN'].includes(currentCookieVal)) {
          moreLangsSelect.value = currentCookieVal;
          moreLangsSelect.classList.add('active');
        }
      }
    }
  }, 500);
}

function updateUIActiveState(lang) {
  const langButtons = document.querySelectorAll('.lang-btn');
  const moreLangsSelect = document.getElementById('more-langs');

  const mainLangs = ['BM', 'EN', 'ZH'];
  if (mainLangs.includes(lang)) {
    langButtons.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    if (moreLangsSelect) {
      moreLangsSelect.value = '';
      moreLangsSelect.classList.remove('active');
    }
  } else {
    langButtons.forEach(btn => btn.classList.remove('active'));
    if (moreLangsSelect) {
      moreLangsSelect.value = lang;
      moreLangsSelect.classList.add('active');
    }
  }
}

function triggerGoogleTranslate(lang) {
  let langCode = '';
  if (lang === 'BM') langCode = 'ms';
  else if (lang === 'ZH') langCode = 'zh-CN';
  else if (lang === 'EN') langCode = '';
  else langCode = lang;

  if (langCode === '') {
    // Reset cookie to pristine English
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.host;
    
    const currentActive = getGoogtransLanguage();
    if (currentActive && currentActive !== 'en') {
      window.location.reload(true);
      return;
    }
  } else {
    const cookieString = `/en/${langCode}`;
    const domain = window.location.hostname;
    const cookieBase = `googtrans=${cookieString}; path=/;`;
    
    document.cookie = cookieBase;
    if (domain !== 'localhost' && domain !== '127.0.0.1') {
      document.cookie = `${cookieBase} domain=.${domain};`;
    }
  }

  const googleSelect = document.querySelector('.goog-te-combo');
  if (googleSelect) {
    googleSelect.value = langCode;
    googleSelect.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  }

  // Highlight the CORRECT clicked language (BM, ZH, TA, EN, or custom language code)
  updateUIActiveState(lang);
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
    const [generalRes, speechRes, skillsRes, cvRes] = await Promise.all([
      fetch(basePath + 'content/EN/general.md'),
      fetch(basePath + 'content/EN/speech.md'),
      fetch(basePath + 'content/EN/skills.md'),
      fetch(basePath + 'content/EN/cv.md')
    ]);

    const [generalText, speechText, skillsText, cvText] = await Promise.all([
      generalRes.text(),
      speechRes.text(),
      skillsRes.text(),
      cvRes.text()
    ]);

    let finalGeneral = parseGeneral(generalText);
    let finalSpeech = speechText;
    let finalSkills = skillsText;
    let finalCv = cvText;

    let overriddenGeneral = false;
    let overriddenSpeech = false;
    let overriddenSkills = false;
    let overriddenCv = false;
    let generalKeys = [];

    // 2. Overwrite with specific language overrides if lang is not EN
    if (lang !== 'EN') {
      const [overrideGeneral, overrideSpeech, overrideSkills, overrideCv] = await Promise.all([
        fetchOverrideFile(basePath + `content/${lang}/general.md`),
        fetchOverrideFile(basePath + `content/${lang}/speech.md`),
        fetchOverrideFile(basePath + `content/${lang}/skills.md`),
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
      if (overrideSkills) {
        finalSkills = overrideSkills;
        overriddenSkills = true;
      }
      if (overrideCv) {
        finalCv = overrideCv;
        overriddenCv = true;
      }
    }

    contentCache[lang] = {
      general: finalGeneral,
      speech: parseSpeech(finalSpeech),
      skills: parseSkills(finalSkills),
      cv: parseCV(finalCv),
      overridden: {
        general: overriddenGeneral,
        speech: overriddenSpeech,
        skills: overriddenSkills,
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

// Parsing lists (- ) for skills
function parseSkills(text) {
  const lines = text.split(/\r?\n/);
  let html = '<div class="skills-grid">';
  for (let line of lines) {
    line = line.trim();
    if (!line || !line.startsWith('-')) continue;
    const skill = line.replace(/^-\s*/, '').trim();
    html += `
      <div class="skill-chip">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${skill}</span>
      </div>`;
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

  // Render specialized lists
  const skillsContainer = document.getElementById('skills-container');
  if (skillsContainer) {
    skillsContainer.innerHTML = data.skills;
    if (data.overridden && data.overridden.skills) {
      skillsContainer.classList.add('notranslate');
    } else {
      skillsContainer.classList.remove('notranslate');
    }
  }

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

  // Trigger or reset Google Translate, and update UI highlights
  triggerGoogleTranslate(lang);
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
  const shareData = {
    title: document.title,
    text: currentGeneral.profile_tagline || "Dr. Bryan Kek's official portfolio.",
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
  const shareText = encodeURIComponent(`${document.title} - ${currentGeneral.profile_tagline || ""}\n\n`);

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
