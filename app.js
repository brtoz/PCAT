const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();

// TEMPLAT ENGINE
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));

//ROUTES
app.get('/', (req, res) => {
  // res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('index');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
