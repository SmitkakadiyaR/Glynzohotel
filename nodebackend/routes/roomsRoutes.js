const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');

const  roomControllers  = require("../controllers/rooms/roomcontrollers.js");

router.get("/rooms/types",roomControllers.getAllRoomTypes);
router.get('/rooms/available-rooms-by-date-and-type', roomControllers.getAvailableRoomsByDateAndType);
router.get('/rooms/room-by-id/:roomId', roomControllers.getRoomById);
router.get('/rooms/all',roomControllers.getAllRooms)

module.exports = router;
