const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const port = 3000;

// Proxy pentru API
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true
}));

// Servește fișierele statice Angular
app.use(express.static(path.join(__dirname, 'client/dist/test-app')));

// Pentru toate rutele necunoscute, trimite index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/test-app/index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 