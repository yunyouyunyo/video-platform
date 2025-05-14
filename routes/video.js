const express = require('express');
const router = express.Router();
const db = require('../utli/database'); // 依你自己的資料庫模組調整

// 個別影片留言板
router.get('/video/:id/comments', async (req, res) => {
    const videoId = req.params.id;
    try {
        const connection = await db.getConnection();
        const [videoRows] = await connection.execute(
            'SELECT * FROM videos WHERE id = ?',
            [videoId]
        );
        const [commentRows] = await connection.execute(
            'SELECT * FROM comments WHERE video_id = ?',
            [videoId]
        );

        if (videoRows.length === 0) {
            return res.send('找不到該影片');
        }
        connection.release();

        res.render('comments', {
            video: videoRows[0],
            comments: commentRows
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('伺服器錯誤');
    }
});

// 新增留言
router.post('/video/:id/comments', async (req, res) => {
    const videoId = req.params.id;
    const { author, content } = req.body;

    if (!content) return res.send('留言內容不能為空');

    try {
        const connection = await db.getConnection();
        const [rows] = await connection.execute(
            'INSERT INTO comments (video_id, author, content) VALUES (?, ?, ?)',
            [videoId, author || '匿名', content]
        );

        connection.release();
        res.redirect(`/video/${videoId}/comments`);
    } catch (err) {
        console.error(err);
        res.status(500).send('無法新增留言');
    }
});


module.exports = router;
