const mongoose = require("mongoose");

//  Schema
const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    //  Connect this model to Product model
    ref: "Product"
  },
  quantity: { type: Number, default: 1 }
});

//  Model
module.exports = mongoose.model("Order", orderSchema);
