const db = require('../../database');




const bookRoom = async (roomId, userId, booking) => {
    const query = `
        INSERT INTO bookings 
        (booking_confirmation_code, check_in_date, check_out_date, num_of_adults, num_of_children, total_num_of_guest, room_id, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const { checkInDate, checkOutDate, numOfAdults, numOfChildren } = booking;
    const totalNumOfGuest = numOfAdults + numOfChildren;

    // Generate a unique confirmation code (e.g., using a UUID or timestamp)
    const bookingConfirmationCode = `BOOK-${Date.now()}`;

    try {
        const [result] = await db.query(query, [
            bookingConfirmationCode,
            checkInDate,
            checkOutDate,
            numOfAdults,
            numOfChildren,
            totalNumOfGuest,
            roomId,
            userId,
        ]);
        const bookingId = result.insertId;
        return {bookingId,bookingConfirmationCode}
    } catch (error) {
        console.error("Error booking room:", error);
        throw error;
    }
};


const getBookingByConfirmationCode = async (bookingCode) => {
    const query = `
        SELECT 
            b.id, 
            b.booking_confirmation_code, 
            b.check_in_date, 
            b.check_out_date, 
            b.num_of_adults, 
            b.num_of_children, 
            b.total_num_of_guest, 
            r.room_description, 
            r.room_price, 
            r.room_type, 
            r.room_photo_url, 
            u.name AS user_name, 
            u.email AS user_email,
            u.phone_number AS user_phone
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.booking_confirmation_code = ?;
    `;

    const [rows] = await db.query(query, [bookingCode]);
    if (rows.length === 0) {
        return null; // No booking found
    }
    return rows[0]; // Return the first result
};

module.exports = {
    bookRoom,getBookingByConfirmationCode
};