const express = require("express");
const router = express.Router();

const  authControllers  = require("../controllers/auth/authcontrollers.js");
const authorize = require('../middlewares/authMiddleware');
// const verifyToken = require("../Middlewares/auth.middleware");

router.post("/auth/register", authControllers.userRegister);
router.post("/auth/login", authControllers.userLogin);
router.get("/users/all",authorize, authControllers.getAllUser);

// router.get("/auth/protected", verifyToken, authControllers.protected);
// router.post(
//   "/auth/change-password",
//   verifyToken,
//   authControllers.changePassword
// );
// router.post(
//   "/changeStatus/:id",
//   verifyToken,
//   authControllers.activeInactiveUser
// );
// router.get("/getAllUser", verifyToken, authControllers.getAllUser);

module.exports = router;