const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("-__v")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "/orders/" + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: "Could not get orders"
      });
    });
});

router.post("/", (req, res, next) => {
  //  Quantity defaults to 1
  const { productID, quantity = 1 } = req.body;
  //  Validate data
  if (productID && productID.length > 0 && quantity > 0) {
    //  Check if product exists
    Product.findById(productID)
      .exec()
      .then(product => {
        if (!product) {
          throw new Error("Product not found");
        }

        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          product: productID,
          quantity
        });
        return order.save();
      })
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
        return res.status(500).json({
          error: "Invalid product order"
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
