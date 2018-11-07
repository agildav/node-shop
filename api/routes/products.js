const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

//  Get all products
router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then(products => {
      const response = {
        count: products.length,
        products: products.map(product => {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            request: {
              type: "GET",
              url: "/products/" + product._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
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
    if (name.length > 0 && price >= 0) {
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
          const response = {
            success: {
              _id: result._id,
              name: result.name,
              price: result.price,
              request: {
                type: "GET",
                url: "/products/" + result._id
              }
            }
          };
          res.status(201).json(response);
        })
        .catch(err => {
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
        .select("-__v") //  Exclude version
        .exec()
        .then(doc => {
          if (doc) {
            res.status(200).json(doc);
          } else
            res.status(404).json({
              error: "Could not find product"
            });
        })
        .catch(err => {
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
      //  Validate req.body data
      if (updateOps.name || updateOps.price) {
        if (
          (updateOps.name && updateOps.name.length > 0) ||
          (updateOps.price && updateOps.price >= 0)
        ) {
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
              res.status(500).json({
                error: "Could not patch product"
              });
            });
        } else {
          res.status(400).json({
            message: "Invalid data submitted"
          });
        }
      } else {
        //  No data submitted
        res.status(200).json({
          message: "No data submitted"
        });
      }
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
          if (result.n > 0) {
            res.status(200).json("Product deleted");
          } else
            res.status(404).json({
              error: "Could not delete product"
            });
        })
        .catch(err => {
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
