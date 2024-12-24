const express = require("express");
const router = express.Router();
const authorize = require('../middlewares/authMiddleware');
const  userControllers  = require("../controllers/users/usercontrollers.js");

router.get("/users/get-logged-in-profile-info",authorize,userControllers.getUserProfile)




module.exports = router;