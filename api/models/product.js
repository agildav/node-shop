const mongoose = require("mongoose");

//  Schema
const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

//  Model
module.exports = mongoose.model("Product", productSchema);
