// app.js
const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const path = require('path');

require('dotenv').config();
// 中介層
app.use(session({
  secret: process.env.SESSION_SECRET, // 替換成自己的 key
  resave: false,
  saveUninitialized: true
}));

// 設定 view
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 登入後頁面
const homeRoutes = require("./routes/home");
app.use('/home', homeRoutes);

// 路由
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const videoRoutes = require('./routes/video');
app.use('/',videoRoutes);


// 在 app.js 最後面加入
app.get('/ping', (req, res) => {
  res.send('pong');
});


// 啟動
app.listen(3002, () => {
  console.log('Server running on http://localhost:3002');
});

module.exports = app;