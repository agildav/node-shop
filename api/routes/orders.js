const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders were fetched"
  });
});

router.post("/", (req, res, next) => {
  const { productID, quantity = 1 } = req.body;
  //  Quantity defaults to 1
  if (productID && productID.length > 0 && quantity > 0) {
    const order = new Order({
      _id: mongoose.Types.ObjectId(),
      product: productID,
      quantity
    });

    order
      .save()
      .then(result => {
        const response = {
          success: {
            _id: result._id,
            productID: result.product,
            quantity: result.quantity,
            request: {
              type: "GET",
              url: "/orders/" + result._id
            }
          }
        };
        res.status(201).json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: "Could not save order"
        });
      });
  } else {
    res.status(400).json("Invalid product order");
  }
});

router.get("/:orderID", (req, res, next) => {
  res.status(201).json({
    message: "Order details",
    orderID: req.params.orderID
  });
});

router.delete("/:orderID", (req, res, next) => {
  res.status(201).json({
    message: "Order deleted",
    orderID: req.params.orderID
  });
});

module.exports = router;
