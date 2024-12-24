
const db = require('../../database'); // Assuming database/index.js exports the pool

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('Database connected, test query result:', rows[0].solution);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

testConnection();
async function query(sql, params) {
    const [rows] = await db.query(sql, params);
    return rows;
}

// Check if a user already exists by email
async function checkIfUserExists(email) {
    console.log("emaillllllllll",email)
    const sql = 'SELECT * FROM users WHERE email = ?';
    const result = await query(sql, [email]);
    return result.length > 0;
}

// Register a new user
async function registerUser(name, email, phone_number, hashedPassword) {
    const sql = 'INSERT INTO users (name, email, phone_number, password) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [name, email, phone_number, hashedPassword]);
    return result;
}

async function getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.query(sql, [email]);
    return rows.length > 0 ? rows[0] : null;  // Return the user data if found
}
async function findAllUser() {
    const sql = 'SELECT * FROM users ';
    const rows = await query(sql);
    return rows;  // Return the user data if found
}
module.exports = { checkIfUserExists, registerUser,getUserByEmail,findAllUser };