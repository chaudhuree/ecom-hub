const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require("../helpers/auth.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//register
const registerController = async (req, res) => {
  try {
    const { userId, password, email } = req.body;
    const existingUserId = await userModel.findOne({ userId });
    if (existingUserId) {
      return res
        .status(201)
        .json({ error: "User Is Already Available With This userId" });
    }
    const existingUserEmail = await userModel.findOne({ email });
    if (existingUserEmail) {
      return res
        .status(201)
        .json({ error: "User Is Already Available With This Email" });
    }
    //hash password
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({ ...req.body, password: hashedPassword });
    await newUser.save();
    newUser.password = undefined;
    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ user: newUser, token });
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};

// login user
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const user = await userModel.findOne({ userId });
    if (user) {
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(201).json({ error: "Invalid userId or password" });
      }
      user.password = undefined;
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).json({ user, token });
    } else {
      res.status(201).json({
        error: "Login Fail",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({ role: 0 });
    res.status(200).send(users);
  } catch (error) {
    res.status(201).send("error", error);
    console.log(error);
  }
};
module.exports = {
  loginController,
  registerController,
  getAllUsers,
};
