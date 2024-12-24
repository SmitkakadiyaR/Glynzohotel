require('dotenv').config(); // Load environment variables from .env

module.exports = {
    host: process.env.DB_HOST || 'localhost',  // Default to localhost if not provided
    user: process.env.DB_USER || 'root',       // Default to 'root'
    password: process.env.DB_PASSWORD || '',   // Default to an empty password
    database: process.env.DB_NAME || 'glynzohotel', // Your database name
    port: process.env.DB_PORT || 3306          // Default MySQL port
};
