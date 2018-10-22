const express = require("express");
const app = express();

//  Routes
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

//  Controllers
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

//  Error pages
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
