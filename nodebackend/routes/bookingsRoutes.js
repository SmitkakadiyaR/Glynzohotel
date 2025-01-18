const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');
const  bookingControllers  = require("../controllers/booking/bookingcontrollers.js");

router.post('/bookings/book-room/:roomId/:userId', bookingControllers.bookRoom);
router.get('/bookings/get-by-confirmation-code/:bookingCode', bookingControllers.getBookingByConfirmationCode);
router.get('/bookings/all',bookingControllers.getAllBookings);
// router.delete('/bookings/cancle/:bookingId',bookingControllers.cancelBooking);
router.get('/bookings/cancel/:bookingId',bookingControllers.cancelBooking);
module.exports = router;