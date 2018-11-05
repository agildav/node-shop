const mongoose = require("mongoose");

//  Schema
const productSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  price: Number
});

//  Model
module.exports = mongoose.model("Product", productSchema);
