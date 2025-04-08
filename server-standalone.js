const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const port = 5001;

// Proxy pentru API
app.all('/api/*', (req, res) => {
  const options = {
    hostname: 'localhost',
    port: 8080,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  req.pipe(proxyReq);
});

// Servește fișierele statice
app.use(express.static(path.join(__dirname, 'client/src')));

// Toate celelalte rute trimit index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/src/index.html'));
});

app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`);
}); 