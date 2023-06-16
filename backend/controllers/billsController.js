const billsModel = require("../models/billsModel");
const itemModel = require("../models/itemModel");
const braintree = require("braintree");
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

// docs: braintree generate token 
const getToken = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (err) {
    console.log(err);
  }
};
//add items
const decrementQuantity = async (cart) => {
  try {
    // build mongodb query
    const bulkOps = cart.map((item) => {
      return {
        updateOne: {
          filter: { _id: item._id },
          update: { $inc: { qty: -item.quantity } },
        },
      };
    });

    const updated = await itemModel.bulkWrite(bulkOps, {});
    console.log("blk updated", updated);
  } catch (err) {
    console.log(err);
  }
};
const addBillsController = async (req, res) => {
  try {
    // console.log("req.body", req.body.cartItems);
    const {nonce,cartItems,totalAmount}=req.body;
    let total = totalAmount;
    //////
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {


          const newBill = new billsModel({...req.body,payment:result});
          newBill.save();
          decrementQuantity(req.body.cartItems);
    res.send("Bill Created Successfully!");
        } else {
          res.status(500).send(error);
        }
      }
    );

    //////
    // const newBill = new billsModel(req.body);
    // await newBill.save();
    // await decrementQuantity(req.body.cartItems);
    // res.send("Bill Created Successfully!");
  } catch (error) {
    res.send("something went wrong");
    console.log(error);
  }
};



//get blls data
const getBillsController = async (req, res) => {
  try {
    const bills = await billsModel.find();
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};



// get bill of a particular user
const getBillOfUser = async (req, res) => {
  try {
    const { id } = req.params;
    const bills = await billsModel.find({ userId: id });
    res.send(bills);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addBillsController,
  getBillsController,
  getBillOfUser,
  getToken
};
