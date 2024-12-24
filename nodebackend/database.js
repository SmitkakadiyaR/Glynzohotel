// import mysql from 'mysql2';
const mysql = require('mysql2');

const dbConfig = require('./config/dbconfig');

const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    
}).promise();

module.exports = pool;





// const [ans] = await getOneNote(3);
// console.log(ans);