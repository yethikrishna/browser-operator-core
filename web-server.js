#!/usr/bin/env node

// Simple web server to run Browser Operator in a web browser
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

// MIME type mapping
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.ts': 'text/typescript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.wasm': 'application/wasm',
  '.map': 'application/json'
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeTypes[ext] || 'application/octet-stream';
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('File not found');
      return;
    }

    const mimeType = getMimeType(filePath);
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // Serve root as index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Remove leading slash and resolve file path
  const filePath = path.join(__dirname, pathname.substring(1));

  // Security check - don't serve files outside the project directory
  const resolvedPath = path.resolve(filePath);
  const projectRoot = path.resolve(__dirname);
  
  if (!resolvedPath.startsWith(projectRoot)) {
    res.writeHead(403, {'Content-Type': 'text/plain'});
    res.end('Access denied');
    return;
  }

  // Check if file exists
  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('File not found');
      return;
    }

    serveFile(resolvedPath, res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Browser Operator web server running at http://${HOST}:${PORT}`);
  console.log(`📂 Serving files from: ${__dirname}`);
  console.log(`🌐 Open http://${HOST}:${PORT} in your browser to use Browser Operator`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down Browser Operator web server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});