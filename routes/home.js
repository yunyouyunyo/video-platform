// routes/home.js
const express = require('express');
const router = express.Router();
const db = require('../utli/database');

router.get('/', async (req, res) => {
    if (!req.session.user) { return res.redirect('/login'); }

    const user = req.session.user;
    try {
        const connection = await db.getConnection();
        const [videos] = await connection.execute(
            'SELECT * FROM videos'
        );
        connection.release();
        res.render('home', { videos: videos, user: user });
    } catch (err) {
        console.log('video load fail.....', err.message);
        res.status(500).send('Server Error');
    }


})

// 顯示表單
router.get('/add-video', (req, res) => {
    res.render('add-video');
});

// 接收表單提交
router.post('/add-video', async (req, res) => {
    try {
        const { title, url } = req.body;
        const connection = await db.getConnection();
        const [results] = await connection.execute(
            'INSERT INTO videos (title, url) VALUES (?, ?)',
            [title, url]
        );
        connection.release();
        console.log('Success add video');
        res.redirect('/home');
    } catch (err) {
        console.error('新增影片失敗', err.message);
        res.status(500).send('伺服器錯誤');
    }
});

module.exports = router
