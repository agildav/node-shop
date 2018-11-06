const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

//  Get all products
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(products => res.status(200).json(products))
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "Could not get products"
      });
    });
});

//  Create a product
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
            createdProduct: result
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
  //  Validate data
  if (productID) {
    if (productID.length > 0) {
      //  Valid data
      Product.findById(productID)
        .exec()
        .then(doc => {
          if (doc) {
            console.log(doc);
            res.status(200).json(doc);
          } else
            res.status(404).json({
              error: "Could not find product"
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: "Could not get product"
          });
        });
    } else {
      //  Invalid data
      res.status(400).json({
        error: "Invalid product ID"
      });
    }
  } else {
    //  No data submitted
    res.status(400).json({
      error: "No product ID submitted"
    });
  }
});

//  Update a product
router.patch("/:productID", (req, res, next) => {
  const productID = req.params.productID;
  //  Validate data
  if (productID) {
    if (productID.length > 0) {
      //  Valid data
      const updateOps = {};
      for (const ops of req.body) {
        //  Req.body must be one of:
        //  [{propName: "", value: ""}, {"propName": "", value: ""}]
        //  [{propName: "", value: ""}]
        updateOps[ops.propName] = ops.value;
      }
      //  TODO: Validate req.body data
      Product.updateOne({ _id: productID }, { $set: updateOps })
        .exec()
        .then(result => {
          if (result) {
            res.status(200).json(result);
          } else
            res.status(404).json({
              error: "Could not update product"
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: "Could not patch product"
          });
        });
    } else {
      //  Invalid data
      res.status(400).json({
        error: "Invalid product ID"
      });
    }
  } else {
    //  No data submitted
    res.status(400).json({
      error: "No product ID submitted"
    });
  }
});

//  Delete a product
router.delete("/:productID", (req, res, next) => {
  const productID = req.params.productID;
  //  Validate data
  if (productID) {
    if (productID.length > 0) {
      //  Valid data
      Product.deleteOne({ _id: productID })
        .exec()
        .then(result => {
          if (result) {
            res.status(200).json(result);
          } else
            res.status(404).json({
              error: "Could not delete product"
            });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: "Could not remove product"
          });
        });
    } else {
      //  Invalid data
      res.status(400).json({
        error: "Invalid product ID"
      });
    }
  } else {
    //  No data submitted
    res.status(400).json({
      error: "No product ID submitted"
    });
  }
});

module.exports = router;
