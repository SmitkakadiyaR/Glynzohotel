const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');
const  bookingControllers  = require("../controllers/booking/bookingcontrollers.js");

router.post('/bookings/book-room/:roomId/:userId', bookingControllers.bookRoom);
router.get('/bookings/get-by-confirmation-code/:bookingCode', bookingControllers.getBookingByConfirmationCode);

module.exports = router;