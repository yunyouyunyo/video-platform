const mysql = require('mysql2/promise');

const pool = mysql.createPool({    
    host: '192.168.56.40',          
    user: 'root',                   
    password: 'user',               
    database: 'user_info',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check connection
(async()=>{
    try{
        const connection = await pool.getConnection();
        console.log("get connection!");
        connection.release();
    }
    catch(err){
        console.error('MySQL connection failed:',err.message);
    }
})();

module.exports = pool;


