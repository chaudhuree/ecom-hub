const express = require("express");
const {
  addBillsController,
  getBillsController,
  getBillOfUser,getToken
} = require("./../controllers/billsController");
const { requireSignin,isAdmin } = require("../middleware/admin");

const router = express.Router();

//routes

//add bill
router.post("/add-bills",requireSignin ,addBillsController);

//get all bills
router.get("/get-bills",requireSignin, isAdmin, getBillsController);

//get bill of a particular user
router.get("/get-bill/:id",requireSignin, getBillOfUser);
router.get("/braintree/token", getToken);
module.exports = router;
