const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /products"
  });
});

router.post("/", (req, res, next) => {
  //  Create model
  const { name, price } = req.body;
  //  Validate data
  if (name && price) {
    if (name.length > 0 && price > 0) {
      //  Valid data
      const data = {
        _id: new mongoose.Types.ObjectId(),
        ...{ name },
        ...{ price }
      };
      const product = new Product(data);

      product
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Handling POST requests to /products",
            createdProduct: product
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: "Could not save product"
          });
        });
    } else {
      //  Invalid data
      res.status(400).json({
        error: "Invalid product info"
      });
    }
  } else {
    //  No data submitted
    res.status(400).json({
      error: "No product info submitted"
    });
  }
});

//  Specific product
router.get("/:productID", (req, res, next) => {
  const productID = req.params.productID;
  if (productID === "special") {
    res.status(200).json({
      message: `You discovered the special ID: ${productID}`
    });
  } else {
    res.status(200).json({
      message: "You passed an ID"
    });
  }
});

router.patch("/:productID", (req, res, next) => {
  res.status(200).json({
    message: "Updated product!"
  });
});

router.delete("/:productID", (req, res, next) => {
  res.status(200).json({
    message: "Deleted product!"
  });
});

module.exports = router;
