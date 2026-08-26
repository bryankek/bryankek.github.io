const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5500;
const WATCH_DIR = __dirname;

// Keep track of connected clients for Server-Sent Events (SSE)
let clients = [];

// MIME types lookup
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.md': 'text/markdown; charset=utf-8',
  '.woff2': 'font/woff2'
};

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Handle Server-Sent Events (SSE) reload endpoint
  if (req.url === '/reload-sse') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    
    // Send initial handshake
    res.write(': handshake\n\n');
    clients.push(res);

    req.on('close', () => {
      clients = clients.filter(client => client !== res);
    });
    return;
  }

  // Sanitize path to prevent directory traversal
  let decodedUrl = decodeURIComponent(req.url);

  // 1. If it's a language route without a trailing slash, redirect to trailing slash
  const isLangRouteNoSlash = /^\/(ms|en|cn)$/.test(decodedUrl);
  if (isLangRouteNoSlash) {
    res.writeHead(301, { 'Location': decodedUrl + '/' });
    res.end();
    return;
  }

  // 2. If it's a language route with trailing slash, serve the root index.html
  const isLangRouteWithSlash = /^\/(ms|en|cn)\/(index\.html)?$/.test(decodedUrl);
  
  let filePath;
  if (isLangRouteWithSlash) {
    filePath = path.join(WATCH_DIR, 'index.html');
  } else {
    // Strip language prefix for static assets if present
    const langPrefixMatch = decodedUrl.match(/^\/(ms|en|cn)(\/.*)$/);
    let resolvedUrl = decodedUrl;
    if (langPrefixMatch) {
      resolvedUrl = langPrefixMatch[2];
    }
    filePath = path.join(WATCH_DIR, resolvedUrl === '/' ? 'index.html' : resolvedUrl);
  }
  
  // Guard against traversal outside workspace
  if (!filePath.startsWith(WATCH_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // If path is a directory, look for index.html inside it
  try {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (err) {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  // Read and serve file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });

    // Inject hot reload script into HTML files
    if (contentType === 'text/html') {
      let htmlString = content.toString();
      const injectScript = `
        <!-- Live Reload Script -->
        <script>
          (function() {
            const sse = new EventSource('/reload-sse');
            sse.onmessage = function(e) {
              console.log('File changed. Reloading...');
              window.location.reload();
            };
            sse.onerror = function() {
              console.warn('Live reload connection lost. Retrying...');
            };
          })();
        </script>
      `;
      // Insert before close body tag if exists, otherwise append
      if (htmlString.includes('</body>')) {
        htmlString = htmlString.replace('</body>', `${injectScript}</body>`);
      } else {
        htmlString += injectScript;
      }
      res.end(htmlString);
    } else {
      res.end(content);
    }
  });
});

// Broadcast reload event to all connected clients
let debounceTimeout;
function broadcastReload(filename) {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    console.log(`[Reload] File changed: ${filename}. Broad-casting reload signal...`);
    clients.forEach(client => {
      client.write('data: reload\n\n');
    });
  }, 100); // 100ms debounce
}

// Watch workspace directory recursively
fs.watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
  // Ignore dotfiles, temp files, and server.js itself
  if (filename && !filename.startsWith('.') && filename !== 'server.js') {
    broadcastReload(filename);
  }
});

// Start listening
server.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `🚀 Dev server is running with live reload!`);
  console.log(`   Local URL:  http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop.`);
});
