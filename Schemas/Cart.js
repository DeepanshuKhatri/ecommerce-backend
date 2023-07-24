const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  price:Number,
  discount:Number,
  buyer_email: String,
  vendor_email:String,
  brand:String,
  buyer_name: String,
  vendor_name: String,
  quantity: Number,
  image:String,
  product_id: String,
  category: [String], 
});

module.exports = mongoose.model("Cart", cartSchema);
