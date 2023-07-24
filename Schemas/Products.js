const mongoose = require('mongoose');


const productSchema = mongoose.Schema({

    vendor_name:String,
    vendor_email:String,
    product_name:String,
    approved: String,
    image:[String],
    desc: String,
    price:Number,
    discount:Number,
    stock:Number,
    sold: Number,
    category:[String],
    brand:String,

})

module.exports = mongoose.model("Products", productSchema);