const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    name:String,
    number:String,
    address:String,
    locality:String,
    city:String,
    state:String
})


const userSchema = mongoose.Schema({
    name:String,
    email:String, 
    disabled:Boolean,
    password:String,
    role:String,
    address:[addressSchema],
    image:String,
    number:String,
    // cart:[[String, Number]]
})

module.exports = mongoose.model("Users", userSchema);
