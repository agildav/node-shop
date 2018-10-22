const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /products"
  });
});

router.post("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling POST requests to /products"
  });
});

//  Specific product
router.get("/:productID", (req, res, next) => {
  const productID = req.params.productID;
  res.status(200).json({
    message: "Handling GET requests to /products"
  });
});

module.exports = router;
