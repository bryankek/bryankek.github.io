// i18n Translation Dictionary for schedules chrome (back link, title, loading, no events etc.)
const i18n = {
  BM: {
    back_to_profile: 'Profil Utama',
    page_title: 'Jadual & Pergerakan Dr Bryan',
    loading: 'Memuat turun jadual dari Google Sheets...',
    no_events: 'Tiada acara dijadualkan buat masa ini.'
  },
  EN: {
    back_to_profile: 'Back to Profile',
    page_title: 'Official Schedule',
    loading: 'Loading schedule from Google Sheets...',
    no_events: 'No events scheduled at the moment.'
  },
  ZH: {
    back_to_profile: '返回主页',
    page_title: '官方日程',
    loading: '正在从 Google 电子表格加载日程...',
    no_events: '目前暂无计划活动。'
  }
};

let currentLang = 'BM';
let eventsList = [];

const pagination = {
  upcoming: { limit: 3, totalGroups: 0 },
  past: { limit: 3, totalGroups: 0 }
};

function detectLanguage() {
  const saved = localStorage.getItem('dr_bryan_lang');
  if (saved) return saved;

  const browserLang = (navigator.language || '').toLowerCase();
  if (browserLang.startsWith('zh')) return 'ZH';
  if (browserLang.startsWith('en')) return 'EN';
  return 'BM'; // default
}

// 2. Tab toggling
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.events-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

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

document.addEventListener('DOMContentLoaded', async () => {
  currentLang = detectLanguage();
  initTabs();
  
  // Set chrome translations
  updateChromeTranslations();
  
  // Load dynamic schedule from Google Sheets CSV
  await loadSchedulesFromSheets();
});

function updateChromeTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[currentLang] && i18n[currentLang][key]) {
      el.innerHTML = i18n[currentLang][key];
    }
  });
  
  // Update document language tag
  let docLang = 'ms';
  if (currentLang === 'ZH') docLang = 'zh';
  else if (currentLang === 'EN') docLang = 'en';
  document.documentElement.lang = docLang;
}


// 3. Robust CSV Parser
function parseCSV(csvText) {
  const lines = [];
  let currentLine = [];
  let currentToken = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentToken += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentToken += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentLine.push(currentToken.trim());
        currentToken = '';
      } else if (char === '\n' || char === '\r') {
        currentLine.push(currentToken.trim());
        currentToken = '';
        if (currentLine.length > 0 && currentLine.some(cell => cell !== '')) {
          lines.push(currentLine);
        }
        currentLine = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n
        }
      } else {
        currentToken += char;
      }
    }
  }
  if (currentToken !== '' || currentLine.length > 0) {
    currentLine.push(currentToken.trim());
    lines.push(currentLine);
  }
  return lines;
}

// 4. Fetch from Google Sheet
async function loadSchedulesFromSheets() {
  const sheetsUrl = 'https://docs.google.com/spreadsheets/d/1r40ubYnXlQ6b484jNT7dmsBhHZjt4UDIwsH0fjOiNQs/export?format=csv';
  try {
    const response = await fetch(sheetsUrl);
    if (!response.ok) {
      throw new Error(`Google Sheets fetch failed with status: ${response.status}`);
    }
    const csvText = await response.text();
    const csvData = parseCSV(csvText);
    
    // Process rows (skip header row)
    if (csvData.length <= 1) {
      renderEmptyState();
      return;
    }
    
    eventsList = [];
    const rows = csvData.slice(1);
    
    for (const row of rows) {
      // Row schema: Date, StartTime, EndTime, Act_EN, Act_BM, Act_CN, Desc_EN, Desc_BM, Desc_CN, Lokasi, MapLink
      if (row.length < 6) continue; // Skip incomplete rows
      
      eventsList.push({
        date: row[0],
        lokasi: row[1] || '',
        mapLink: row[2] || '',
        timeStart: row[3] || '',
        timeEnd: row[4] || '',
        activityEN: row[5] || '',
        activityBM: row[6] || '',
        activityCN: row[7] || '',
        descEN: row[8] || '',
        descBM: row[9] || '',
        descCN: row[10] || ''
      });
    }
    
    renderEvents();
  } catch (error) {
    console.error('Failed to load live schedules:', error);
    const container = document.getElementById('upcoming-events-list');
    if (container) {
      container.innerHTML = `<p class="loading-placeholder" style="color: #d02b2b;">Gagal memuat turun jadual secara langsung. Sila pastikan anda mempunyai sambungan internet.</p>`;
    }
  }
}

// Helper to get sort timestamp (start time)
function getEventSortKey(event) {
  const dateParts = event.date.split('/');
  if (dateParts.length !== 3) return 0;
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // 0-indexed month
  const year = parseInt(dateParts[2], 10);
  
  const padTime = event.timeStart.padStart(4, '0');
  const hour = parseInt(padTime.substring(0, 2), 10) || 0;
  const minute = parseInt(padTime.substring(2, 4), 10) || 0;
  
  return new Date(year, month, day, hour, minute).getTime();
}

// Helper to get end time timestamp for status filtering
function getEventEndSortKey(event) {
  const dateParts = event.date.split('/');
  if (dateParts.length !== 3) return 0;
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);
  
  const endTimeStr = event.timeEnd || event.timeStart;
  const padTime = endTimeStr.padStart(4, '0');
  const hour = parseInt(padTime.substring(0, 2), 10) || 0;
  const minute = parseInt(padTime.substring(2, 4), 10) || 0;
  
  return new Date(year, month, day, hour, minute).getTime();
}

// Format 24h HHMM string into nice AM/PM time, e.g. "1100" -> "11:00 AM"
function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const padded = timeStr.padStart(4, '0');
  const hour24 = parseInt(padded.substring(0, 2), 10);
  const minute = padded.substring(2, 4);
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute} ${ampm}`;
}

// 5. Render to UI
function renderEvents() {
  const upcomingListEl = document.getElementById('upcoming-events-list');
  const pastListEl = document.getElementById('past-events-list');
  
  if (!upcomingListEl || !pastListEl) return;
  
  const now = Date.now();
  const upcomingEvents = [];
  const pastEvents = [];
  
  eventsList.forEach(evt => {
    const sortKey = getEventSortKey(evt);
    const endSortKey = getEventEndSortKey(evt);
    
    // Sort into upcoming vs past based on endSortKey
    if (endSortKey >= now) {
      upcomingEvents.push({ ...evt, sortKey });
    } else {
      pastEvents.push({ ...evt, sortKey });
    }
  });
  
  // Sort: Upcoming (chronological asc), Past (chronological desc)
  upcomingEvents.sort((a, b) => a.sortKey - b.sortKey);
  pastEvents.sort((a, b) => b.sortKey - a.sortKey);
  
  // Render lists
  upcomingListEl.innerHTML = buildEventsHtml(upcomingEvents, 'upcoming');
  pastListEl.innerHTML = buildEventsHtml(pastEvents, 'past');
}

function buildEventsHtml(events, tabType) {
  if (events.length === 0) {
    return `<p class="loading-placeholder">${i18n[currentLang].no_events}</p>`;
  }
  
  // Group events by date (maintaining chronological sorted order)
  const groups = {};
  const dateOrder = []; // to preserve chronological order of keys
  events.forEach(evt => {
    const d = evt.date;
    if (!groups[d]) {
      groups[d] = [];
      dateOrder.push(d);
    }
    groups[d].push(evt);
  });
  
  const limit = pagination[tabType].limit;
  pagination[tabType].totalGroups = dateOrder.length;
  
  const visibleDates = dateOrder.slice(0, limit);
  let html = '';
  
  // Render date groups sequentially
  visibleDates.forEach(date => {
    const groupEvents = groups[date];
    
    html += `
      <div class="date-group">
        <div class="date-header">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>${date}</span>
        </div>
        <div class="date-events-list">
    `;
    
    groupEvents.forEach(evt => {
      const timeStartFmt = formatTime12h(evt.timeStart);
      const timeEndFmt = formatTime12h(evt.timeEnd);
      const timeRange = timeEndFmt ? `${timeStartFmt} - ${timeEndFmt}` : timeStartFmt;
      
      const exactLocation = evt.lokasi || 'N.19 Kesidang, Melaka';
      const locationHtml = evt.mapLink 
        ? `<a href="${evt.mapLink}" target="_blank" class="event-map-link">${exactLocation}</a>`
        : exactLocation;
        
      html += `
        <div class="event-card">
          <div class="event-node"></div>
          
          <div class="event-time-row">
            <span class="event-time-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>${timeRange}</span>
            </span>
          </div>
          
          <div class="event-exact-location">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${locationHtml}</span>
          </div>
          
          <div class="event-multilang-content">
            ${(evt.activityBM || evt.descBM) ? `
              <!-- Bahasa Malaysia Row -->
              <div class="event-lang-row bm">
                <div class="lang-text-group">
                  ${evt.activityBM ? `<h4 class="event-title-lang">${evt.activityBM}</h4>` : ''}
                  ${evt.descBM ? `<p class="event-desc-lang">${evt.descBM}</p>` : ''}
                </div>
              </div>
            ` : ''}
            ${(evt.activityEN || evt.descEN) ? `
              <!-- English Row -->
              <div class="event-lang-row en">
                <div class="lang-text-group">
                  ${evt.activityEN ? `<h4 class="event-title-lang">${evt.activityEN}</h4>` : ''}
                  ${evt.descEN ? `<p class="event-desc-lang">${evt.descEN}</p>` : ''}
                </div>
              </div>
            ` : ''}
            ${(evt.activityCN || evt.descCN) ? `
              <!-- Chinese Row -->
              <div class="event-lang-row zh">
                <div class="lang-text-group">
                  ${evt.activityCN ? `<h4 class="event-title-lang">${evt.activityCN}</h4>` : ''}
                  ${evt.descCN ? `<p class="event-desc-lang">${evt.descCN}</p>` : ''}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  // Render "Load More" button if there are more dates to display
  if (dateOrder.length > limit) {
    let btnText = 'Muat Lebih Banyak';
    if (currentLang === 'EN') btnText = 'Load More';
    else if (currentLang === 'ZH') btnText = '加载更多';
    
    html += `
      <div class="load-more-container">
        <button class="load-more-btn" onclick="handleLoadMore('${tabType}')">${btnText}</button>
      </div>
    `;
  }
  
  return html;
}

function handleLoadMore(tabType) {
  pagination[tabType].limit += 3;
  renderEvents();
}

function renderEmptyState() {
  const upcomingListEl = document.getElementById('upcoming-events-list');
  const pastListEl = document.getElementById('past-events-list');
  const msg = i18n[currentLang].no_events;
  if (upcomingListEl) upcomingListEl.innerHTML = `<p class="loading-placeholder">${msg}</p>`;
  if (pastListEl) pastListEl.innerHTML = `<p class="loading-placeholder">${msg}</p>`;
}
