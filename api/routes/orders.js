const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, (req, res, next) => {
  Order.find()
    .select("-__v")
    .populate("product", "name price")
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

router.post("/", checkAuth, (req, res, next) => {
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

router.get("/:orderID", checkAuth, (req, res, next) => {
  const orderID = req.params.orderID;
  //  Validate data
  if (orderID) {
    if (orderID.length > 0) {
      //  Valid data
      Order.findById(orderID)
        .select("-__v") //  Exclude version
        .populate("product", "-__v")
        .exec()
        .then(doc => {
          if (doc) {
            res.status(200).json(doc);
          } else
            res.status(404).json({
              error: "Could not find order"
            });
        })
        .catch(err => {
          res.status(500).json({
            error: "Could not get order"
          });
        });
    } else {
      //  Invalid data
      res.status(400).json({
        error: "Invalid order ID"
      });
    }
  } else {
    //  No data submitted
    res.status(400).json({
      error: "No order ID submitted"
    });
  }
});

router.delete("/:orderID", checkAuth, (req, res, next) => {
  const orderID = req.params.orderID;
  //  Validate data
  if (orderID) {
    if (orderID.length > 0) {
      //  Valid data
      Order.deleteOne({ _id: orderID })
        .exec()
        .then(result => {
          if (result.n > 0) {
            res.status(200).json("Order deleted");
          } else
            res.status(404).json({
              error: "Could not delete order"
            });
        })
        .catch(err => {
          res.status(500).json({
            error: "Could not remove order"
          });
        });
    } else {
      //  Invalid data
      res.status(400).json({
        error: "Invalid order ID"
      });
    }
  } else {
    //  No data submitted
    res.status(400).json({
      error: "No order ID submitted"
    });
  }
});

module.exports = router;
