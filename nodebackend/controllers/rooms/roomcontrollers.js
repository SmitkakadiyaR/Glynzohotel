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

// const getAvailableRoomsByDateAndType = async (req, res) => {
//     const { checkInDate, checkOutDate, roomType } = req.query;

//     // Validate query parameters
//     if (!checkInDate || !checkOutDate || !roomType) {
//         return res.status(400).json({ error: 'Missing required query parameters.' });
//     }

//     try {
//         // Fetch data using SQL function
//         const rooms = await roomdb.fetchAvailableRooms(roomType, checkOutDate, checkInDate);
//         console.log("rooms/", rooms);

//         // Send response
//         res.status(200).json({"roomList":rooms,"statusCode":200});
//     } catch (error) {
//         console.error('Error fetching available rooms:', error);
//         res.status(500).json({ error: 'Internal Server Error.' });
//     }
// };
const getAvailableRoomsByDateAndType = async (req, res) => {
    const { checkInDate, checkOutDate, roomType } = req.query;

    // Validate query parameters
    if (!checkInDate || !checkOutDate || !roomType) {
        return res.status(400).json({ error: 'Missing required query parameters.' });
    }

    try {
        // Fetch available rooms based on date and type
        const rooms = await roomdb.fetchAvailableRooms(roomType, checkOutDate, checkInDate);
        console.log("rooms/", rooms);

        if (rooms.length === 0) {
            return res.status(404).json({ message: "No rooms available" });
        }

        // Add imageUrl to each room
        const roomsWithImage = rooms.map(room => ({
            ...room,
            imageUrl: `http://localhost:4040${room.room_photo_url}`, // Construct full image URL
        }));

        // Send response with rooms and their corresponding image URLs
        res.status(200).json({
            message: "Available rooms fetched successfully",
            roomList: roomsWithImage,
            statusCode: 200
        });
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
        const imageUrl=`http://localhost:4040${room.room_photo_url}`
        console.log("imaaaaaaaaaaaaaaaaaaaaaaaaageeeeeeeeeeurllllllllll",imageUrl);

        res.json({"room":room,imageUrl});  // Return the room details in the response
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

        const roomsWithImage = rooms.map(room => ({
            ...room,
            imageUrl: `http://localhost:4040${room.room_photo_url}`, // Construct full URL
        }));

        res.status(200).json({
            message: "Rooms fetched successfully",
            roomList:roomsWithImage
        });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const addRoom= async (req, res) => {
    try {
        const { roomType, roomPrice, roomDescription } = req.body;
        const roomPhotoUrl = req.file ? `/uploads/${req.file.filename}` : '';

        if (!roomType || !roomPrice || !roomDescription) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const roomId = await roomdb.createRoom(roomType, roomPrice, roomDescription, roomPhotoUrl);

        res.status(200).json({
            message: 'Room added successfully.',
            statusCode:200,
            roomId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRoom = async (req, res) => {
    const roomId = req.params.id;

    console.log(roomId,"--------",req.body);

    try {
        // Extract form data
        const { roomType, roomPrice, roomDescription } = req.body;

        // Check if a file is uploaded
        const roomPhotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

        console.log(roomPhotoUrl,"-------------")

        // Get existing room data
        const existingRoom = await roomdb.getRoomById(roomId);
        if (!existingRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // If no new image is uploaded, keep the current one
        const updatedPhotoUrl = roomPhotoUrl || existingRoom.room_photo_url;

        // Create updated room object
        const updatedRoom = {
            roomType,
            roomPrice,
            roomDescription,
            roomPhotoUrl: updatedPhotoUrl,
        };

        // Update the room in the database
        await roomdb.updateRoomById(roomId, updatedRoom);

        // Generate the full image URL
        // const serverUrl =  'http://localhost:4040';
        const imageUrl = `'http://localhost:4040'${updatedPhotoUrl}`;

        // Respond with the updated room details
        res.json({
            message: 'Room updated successfully',
            statusCode:200,
            room: {
                ...updatedRoom,
                id: roomId,
                imageUrl,
            },
        });
    } catch (error) {
        console.error('Error updating room:', error);
        res.status(500).json({ message: 'Error updating room', error: error.message });
    }
};

const deleteRoom = async (req, res) => {
    const roomId = req.params.roomId; // Get the room ID from the URL parameter

    try {
        const wasDeleted = await roomdb.deleteRoom(roomId);

        if (wasDeleted) {
            return res.status(200).json({ message: 'Room deleted successfully' ,statusCode:200});
        } else {
            return res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ message: 'Error deleting rooming' });
    }
};


module.exports = {
    getAllRoomTypes,
    getAvailableRoomsByDateAndType,
    getRoomById,
    getAllRooms,
    addRoom,
    updateRoom,
    deleteRoom
};
