const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 4200;

// Setez MIME types explicit pentru fișierele CSS
app.get('*.css', (req, res, next) => {
  res.set('Content-Type', 'text/css');
  next();
});

// Setez MIME types explicit pentru fișierele JavaScript
app.get('*.js', (req, res, next) => {
  res.set('Content-Type', 'application/javascript');
  next();
});

// Servesc fișierele statice
app.use(express.static(path.join(__dirname, 'dist/test-app')));

// Redirecționez toate rutele către index.html pentru SPA
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/test-app/index.html'));
});

// Pornesc serverul
app.listen(port, () => {
  console.log(`Serverul rulează pe http://localhost:${port}`);
}); 