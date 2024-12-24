// config/jwtConfig.js
require('dotenv').config();

module.exports = {
    secret: "process.env.JWT_SECRET", // Replace with a secure key
    expiresIn: "1h"               // Token expiry time
};
