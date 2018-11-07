const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(cors());

//  MongoDB Connection
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${
  process.env.MONGO_ATLAS_PASSWORD
}@node-shop-api-8lphf.mongodb.net/test?retryWrites=true`;

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

//  Routes
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

//  Controllers
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

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
