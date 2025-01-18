const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./database'); // Import functions from database.js
const authRoute=require('./routes/authRoutes');
const roomsRoute=require('./routes/roomsRoutes');
const userRoute=require('./routes/userRoutes');
const bookingRoute=require('./routes/bookingsRoutes');
const path = require('path');
const  cors =require('cors') ;
const app = express();

// Enable CORS for all origins
app.use(cors());

const PORT = 4040;

// Middleware
app.use(bodyParser.json());
// Enable CORS for all origins
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Register User Endpoint
app.use(authRoute);
app.use(roomsRoute);
app.use(userRoute);
app.use(bookingRoute);
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
