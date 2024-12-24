const roomdb = require('../../model/roommodel/roommodel');
// const bcrypt = require('bcrypt'); // Import functions from database.js
// const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwtconfig');



// Controller function to get all room types
const getAllRoomTypes = async (req, res) => {
    try {
        // Fetch all room types from the database
        const roomTypes = await roomdb.getAllRoomTypes();

        if (roomTypes.length === 0) {
            return res.status(404).json({ message: "No room types found" });
        }

        // Respond with the list of room types
        res.status(200).json({
            message: "Room types retrieved successfully",
            roomTypes,
            statusCode: 200
        });
    } catch (error) {
        console.error("Error in getAllRoomTypes:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAvailableRoomsByDateAndType = async (req, res) => {
    const { checkInDate, checkOutDate, roomType } = req.query;

    // Validate query parameters
    if (!checkInDate || !checkOutDate || !roomType) {
        return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    try {
        // Fetch data using SQL function
        const rooms = await roomdb.fetchAvailableRooms(roomType, checkOutDate, checkInDate);
        console.log("rooms/", rooms);

        // Send response
        res.status(200).json({"roomList":rooms,"statusCode":200});
    } catch (error) {
        console.error('Error fetching available rooms:', error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
};

const getRoomById = async (req, res) => {
    const roomId = req.params.roomId; 
    console.log("rooooooooooooooom is",roomId) // Get roomId from URL parameters

    try {
        const room = await roomdb.getRoomById(roomId);

        if (!room) {
            return res.status(404).json({ message: 'Room not found' });  // If no room found
        }

        res.json({"room":room});  // Return the room details in the response
    } catch (error) {
        console.error("Error in controller:", error);
        res.status(500).json({ message: 'Error fetching room' });  // Return error message
    }
};

const getAllRooms = async (req, res) => {
    try {
        const rooms = await roomdb.getAllRooms();

        if (rooms.length === 0) {
            return res.status(404).json({ message: "No rooms available" });
        }

        res.status(200).json({
            message: "Rooms fetched successfully",
            roomList:rooms
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



module.exports = {
    getAllRoomTypes,
    getAvailableRoomsByDateAndType,
    getRoomById,
    getAllRooms
};
