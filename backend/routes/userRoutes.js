const express = require("express");
const {
  loginController,
  registerController,
  getAllUsers,
} = require("./../controllers/userController");

const { requireSignin, isAdmin } = require("../middleware/admin");
const router = express.Router();

//routes
//login
router.post("/login", loginController);

//register
router.post("/register", registerController);

//get all users
router.get("/allusers", requireSignin, isAdmin, getAllUsers);

module.exports = router;
