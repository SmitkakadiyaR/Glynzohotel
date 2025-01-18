const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multermiddleware');

const  roomControllers  = require("../controllers/rooms/roomcontrollers.js");

router.get("/rooms/types",roomControllers.getAllRoomTypes);
router.get('/rooms/available-rooms-by-date-and-type', roomControllers.getAvailableRoomsByDateAndType);
router.get('/rooms/room-by-id/:roomId', roomControllers.getRoomById);
router.get('/rooms/all',roomControllers.getAllRooms);
router.post('/rooms/add',upload.single('photo'),roomControllers.addRoom);
router.put('/rooms/update/:id',upload.single('photo'),roomControllers.updateRoom);
router.delete('/rooms/delete/:roomId', roomControllers.deleteRoom);

module.exports = router;
