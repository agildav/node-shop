const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET requests to /products"
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Handling POST requests to /products"
  });
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
