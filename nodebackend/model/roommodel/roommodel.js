const db = require('../../database');
async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        console.log('Database connected, test query result:', rows[0].solution);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

const getAllRoomTypes = async () => {
    try {
        const query1 = 'SELECT DISTINCT room_type FROM rooms'; // Fetch unique room types
        const [results] = await db.query(query1) // Use promise-based query
        return results; // Return all distinct room types
    } catch (err) {
        console.error("Error executing query:", err); // Log database query errors
        throw err; // Rethrow error to be handled by the calling function
    }
};
const fetchAvailableRooms = async (roomType, checkOutDate, checkInDate) => {
    try {
        const query = `
            SELECT 
                r.id, 
                r.room_description, 
                r.room_photo_url, 
                r.room_price, 
                r.room_type
            FROM rooms r
            WHERE r.room_type = ?
              AND r.id NOT IN (
                  SELECT b.room_id
                  FROM bookings b
                  WHERE (b.check_in_date <= ? AND b.check_out_date >= ?)
              )`;
        const [rows] = await db.query(query, [roomType, checkOutDate, checkInDate]);
        return rows; 
    } catch (err) {
        console.error("Error executing query:", err);  // Log any error
        return [];  // Return an empty array in case of error
    }
};
const getRoomById = async (roomId) => {
    const query = `
        SELECT 
            r.id, 
            r.room_description, 
            r.room_photo_url, 
            r.room_price, 
            r.room_type
        FROM rooms r
        WHERE r.id = ?;
    `;
    try {
        const [rows] = await db.query(query, [roomId]);
        if (rows.length === 0) {
            return null;
        }
        return rows[0];  // Return the first row (room data)
    } catch (error) {
        console.error("Error fetching room:", error);
        throw error;  // Rethrow error to be handled by the controller
    }
};
const getAllRooms = async () => {
    const query = `
        SELECT 
            id, 
            room_description, 
            room_photo_url, 
            room_price, 
            room_type 
        FROM rooms;
    `;
    const [rows] = await db.query(query);
    return rows; // Return all room details
};
const createRoom=async (roomType, roomPrice, roomDescription, roomPhotoUrl) => {
    const sql = `
        INSERT INTO rooms (room_type, room_price, room_description, room_photo_url)
        VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [roomType, roomPrice, roomDescription, roomPhotoUrl]);
    return result.insertId; // Return the new room's ID
};
const updateRoomById = async (roomId, updatedRoom) => {
    const query = `
        UPDATE rooms
        SET room_type = ?, room_price = ?, room_description = ?, room_photo_url = ?
        WHERE id = ?
    `;
    const values = [
        updatedRoom.roomType,
        updatedRoom.roomPrice,
        updatedRoom.roomDescription,
        updatedRoom.roomPhotoUrl,
        roomId,
    ];
    await db.execute(query, values);
};
const deleteRoom= async(roomId)=> {
    try {
        const [result] = await db.query('DELETE FROM rooms WHERE id = ?', [roomId]);
        return result.affectedRows > 0; // Returns true if a row was deleted
    } catch (error) {
        throw new Error(`Error deleting room: ${error.message}`);
    }
}
module.exports = { getAllRoomTypes,
    fetchAvailableRooms,
    getRoomById,
    getAllRooms,
    createRoom,
    updateRoomById,
    deleteRoom
 };


