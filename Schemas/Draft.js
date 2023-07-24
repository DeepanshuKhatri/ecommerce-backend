const mongoose = require('mongoose');


const draftSchema = mongoose.Schema({

    vendor_name:String,
    vendor_email:String,
    product_name:String,
    approved: String,
    image:[String],
    desc: String,
    price:Number,
    discount:Number,
    stock:Number,
    category:[String],
    brand:String,

})

module.exports = mongoose.model("Draft", draftSchema);