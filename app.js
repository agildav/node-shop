const express = require("express");
const app = express();

//  Routes
const productRoutes = require("./api/routes/products");

app.use("/products", productRoutes);

module.exports = app;
