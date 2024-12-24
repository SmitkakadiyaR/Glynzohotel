const bookingdb= require('../../model/bookingmodel/bookingmodel');

// Controller to book a room
const bookRoom = async (req, res) => {
    const { roomId, userId } = req.params;
    const booking = req.body;

    try {
        // Validate required fields
        if (!roomId || !userId || !booking.checkInDate || !booking.checkOutDate) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Call the service to book the room
        const {bookingId,bookingConfirmationCode}= await bookingdb.bookRoom(roomId, userId, booking);

        res.status(201).json({
            message: 'Room booked successfully',
            bookingId: bookingId,
            statusCode:200,
            bookingConfirmationCode:bookingConfirmationCode
        });
    } catch (error) {
        console.error("Error in booking controller:", error);
        res.status(500).json({ message: 'Error booking room' });
    }
};

const getBookingByConfirmationCode = async (req, res) => {
    const { bookingCode } = req.params;

    try {
        // Fetch booking details from the model
        const bookingDetails = await bookingdb.getBookingByConfirmationCode(bookingCode);

        if (!bookingDetails) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.status(200).json({
            message: "Booking details fetched successfully",
            bookingDetails
        });
    } catch (error) {
        console.error("Error fetching booking details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    bookRoom,getBookingByConfirmationCode
};
