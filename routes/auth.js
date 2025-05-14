// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../utli/database');

// 註冊
router.get('/register', (req, res) => {
  res.render('register');   //對應到register.ejs
});

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('req.body:', req.body); // 看有沒有資料

    const hashed = await bcrypt.hash(password, 10);
    console.log('hashed:', hashed);

    const connection = await db.getConnection();
    const [results] = await connection.execute(
      'INSERT INTO userinfo (UserName, UserPass) VALUES (?, ?)',
      [username, hashed]
    );

      connection.release();
      console.log('DB INSERT OK:', results);
    res.redirect('/login');
  }
  catch (err) {
    console.error('bcrypt 或其他錯誤:', err.message);
    res.status(500).send('伺服器錯誤');
  }


});


// 登入
router.get('/login', (req, res) => {
  res.render('login');    //對應到login.ejs
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await db.getConnection();
    const [results] = await connection.execute(
      'SELECT * FROM userinfo WHERE UserName = ?',
      [username]
    );
    connection.release();
    if (results.length === 0) {
      return res.send('Undefined user.');
    }

    const match = await bcrypt.compare(password, results[0].UserPass);
    if (match) {
      req.session.user = results[0];
      res.redirect('/home');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error('login error', err.message);
    res.status(500).send('伺服器錯誤');
  }
});

// 登出
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
