const express = require("express");
const {
  getItemController,
  addItemController,
  editItemController,
  deleteItemController,
  getSingleItemController,
} = require("./../controllers/itemController");
const { requireSignin, isAdmin } = require("../middleware/admin");
const router = express.Router();

//routes
//get all items
router.get("/get-item", getItemController);

//get item by id
router.get("/item/:id", getSingleItemController);

//create item
router.post("/add-item", requireSignin, isAdmin, addItemController);

//edit item
router.put("/edit-item", requireSignin, isAdmin, editItemController);

//delete item
router.post("/delete-item", requireSignin, isAdmin, deleteItemController);
module.exports = router;
