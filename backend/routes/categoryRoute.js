const express = require("express");
const {
  addCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("./../controllers/categoryController");
const { requireSignin, isAdmin } = require("../middleware/admin");
const router = express.Router();

//routes

//create category
router.post("/create-category",requireSignin, isAdmin, addCategory);

//get all category
router.get("/get-categories", getCategory);

//update category
router.put("/update-category/:id",requireSignin, isAdmin, updateCategory);

//delete category
router.delete("/delete-category/:id",requireSignin, isAdmin, deleteCategory);

module.exports = router;
