const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtconfig'); // Path to your JWT secret config file

// Middleware to verify the JWT token
const authorize = (req, res, next) => {
    console.log("reqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",req.headers);
    const token = req.headers['authorization']; // Get the token from Authorization header

    console.log("user token ________________________",token);

    if (!token) {
        return res.status(403).json({ message: 'No token provided, access denied' });
    }

    try {
        // Extract the token from "Bearer <token>"
        const tokenParts = token.split(' ');
        if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
            return res.status(401).json({ message: 'Invalid token format' });
        }

        const decoded = jwt.verify(tokenParts[1], jwtConfig.secret); // Verify token
        // console.log("decode______________",decoded)
        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authorization Error:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authorize;
