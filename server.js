const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Users = require("./Schemas/Users");
const Products = require("./Schemas/Products");
const Cart = require("./Schemas/Cart");
const Order = require('./Schemas/Order')
const multer = require('multer')
const Draft = require('./Schemas/Draft')

const path=require("path")


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");


///MUlter 
const storage = multer.diskStorage({
  destination:'./uploads/',
  filename:  (req, file, cb)=> {
      cb(null, Date.now() + '-' + file.originalname); 
  }   
});
const upload = multer({ storage });

app.use(express.static(path.join(__dirname,"/uploads")))

app.post('/uploads',upload.single('image'),(req,res)=>{
  console.log(req.file)
  const pic=req.file.filename;
  res.send(pic);
})
// multer
 


app.post("/updateImage",upload.single("image"),async(req,res)=>{
  const id = req.body.id;
  const pic = req.body.pic;
  const image = req.file.filename;
  try {
      const user = await Users.findById(id);
      
      if(!user){
          return res.status(204).json("No such email exists");
      }
      if(pic=="profile"){
          const newUser = await Users.findByIdAndUpdate(id,{image : image });
      }else{
          const newUser = await Users.findByIdAndUpdate(id,{"business.logo" : image });
      }
      
      const updatedUser = await User.findById(id);        
      return res.status(201).json(updatedUser);
  } catch (error) {
      return res.status(400).send("error while updating User!");
  }
})



app.post("/signup", async (req, res) => {
  const accountExists = await Users.findOne({ email: req.body.email });
  console.log(req.body)
  console.log(accountExists);
  if (accountExists) {
    res.status(201);
    res.send(accountExists);
  } else {
    Users.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      number: req.body.number,
      disabled: false,
    });
    res.status(200);
    res.send("Account Created");
  }
});


app.post('/cancelOrder', async(req, res)=>{
  const order =await  Order.findOne({_id:req.body.id})
  order.cancelled = true;
  order.save();
  res.send("order cancelled")
})

app.post('/addSignupDetail', async(req, res)=>{
  console.log(req.body)
  const user =await  Users.findOne({email:req.body.email})
  user.role=req.body.role;
   user.save();
  res.send("Role Selected Successfully")
})

app.post('/updateUser', async (req, res)=>{
  const user = await Users.findOne({email:req.body.email})
  user.image = req.body.image
  user.password = req.body.password
  user.number = req.body.number
  user.save();
  res.send("done");
})

app.post("/login", async (req, res) => {
  const parameter = isNaN(req.body.email)? "email":"number";
  console.log(req.body);
  const accountExists = await Users.exists({
    [parameter]: req.body.email,
    password: req.body.password,
    // disabled: false,
  });
  if (accountExists ) {

    const userDetails = await Users.findOne({
      [parameter]: req.body.email,
      password: req.body.password,
    });
    if(userDetails.disabled===false){
      res.status(200);
      res.send(userDetails);
      }
      else{
        res.status(202)
        res.send(false)
      }
    
  } else {
    res.status(201);
    res.send(false);
  }
});

app.post("/addProduct", async (req, res) => {
  Products.create({
    vendor_name: req.body.vendor_name,
    vendor_email:req.body.vendor_email,
    approved: false,
    // images:req.body.images,
    product_name: req.body.product_name,
    desc: req.body.desc,
    price: req.body.price,
    category: req.body.category,
    stock:req.body.stock,
    image:req.body.image,
    brand:req.body.brand,
    discount:req.body.discount,
  });

  res.send("done");
});

app.get('/bestSelling', async (req, res)=>{
  const data =await  Products.find().sort({ sold: -1 }).limit(3)
  // const sendData = JSON.parse(data);
  res.send(data)
})


app.post("/addDraft", async (req, res) => {
  Draft.create({
    vendor_name: req.body.vendor_name,
    vendor_email:req.body.vendor_email,
    approved: false,
    // images:req.body.images,
    product_name: req.body.product_name,
    desc: req.body.desc,
    price: req.body.price,
    category: req.body.category,
    image:req.body.image,
    brand:req.body.brand,
    discount:req.body.discount,
  });

  res.send("done");
});



app.post("/productAdded", (req, res) => {
  console.log(req.body);
  res.send("Done");
});

app.get("/getProduct", async (req, res) => {
  const x = await Products.find();
  res.send(x);
});

app.post('/updateProduct', async(req, res)=>{
  await Products.updateOne({_id:req.body.id}, {
    price:req.body.price,
    product_name:req.body.product_name,
    category:req.body.category,
    desc:req.body.desc
  })
  res.send("done");
})
app.post("/myProduct", async (req, res) => {
  const data = await Products.find({ vendor_email: req.body.vendor_email });
  console.log(data);
  res.send(data);
});

app.post("/myDraft", async (req, res) => {
  const data = await Draft.find({ vendor_email: req.body.vendor_email });
  console.log(data);
  res.send(data);
});


app.post('/alreadyInCart', async( req, res)=>{
  console.log(req.body)
  const cartExists = await Cart.exists({buyer_email:req.body.buyer_email, product_id:req.body.product_id})
  // console.log(cartExists)
  if(cartExists){
    res.send(true)
  }
  else{
    res.send(false)
  }
})

app.post("/addToCart", async (req, res) => {



  // const cartExists = await Cart.findOne({email:req.body.buyer_email, product_id:req.body.product_id})
  // if(cartExists){
  //   // await Cart.updateOne({email:req.body.buyer_email, product_id:req.body.product_id}, {$inc:{quantity:1}})
  //   res.send("present")
  // }
  // else{
    const data = await Products.findOne({ _id: req.body.product_id });
    console.log(data)
    Cart.create({
        buyer_email: req.body.buyer_email,
        vendor_email:req.body.vendor_email,
      product_id: req.body.product_id,
      buyer_name: req.body.buyer_name,
      quantity: 1,
      vendor_name: data.vendor_name,
      category: data.category,
      brand:req.body.brand,
      name:req.body.product_name,
      price:req.body.price,
      discount:req.body.discount,
      image:req.body.image
    })

    res.send("Added")
  // }
  // const cartExists = await Cart.findOne({email:req.body.buyer_email, product_id: req.body.product_id})
  // console.log(cartExists)
  // if(cartExists){
  //   await Cart.updateOne({email:req.body.buyer_email, product_id: req.body.product_id},{$inc:{quantity:1}})
  //   res.send("updated")
  // }
  // else{
  //   res.send("Added")
  // }

});

app.post("/getCartItems", async (req, res) => {
  console.log(req.body)
  const data = await Cart.find({ buyer_email: req.body.customer_email });
  res.send(data);
});

app.post("/getCartProduct", async (req, res) => {
  const data = await Products.findOne({ _id: req.body.product_id });
  console.log(data);
  res.send(data);
});

app.post('/removeFromCart', async(req, res)=>{
  console.log(req.body)
    const ress = await Cart.deleteOne({ _id: req.body.product_id})
    res.send("deleted");
  })

  app.post('/updateStock', async(req, res)=>{
    const product = await Products.findOne({_id:req.body.id});
    product.stock -= req.body.quantity,
    sold += req.body.quantity
    product.save();
    res.send("Updated Stock")
  })

app.post('/placeOrder', async (req, res)=>{
  const data = req.body.cartItems;
  // console.log(data[0])
  Order.create(
      ...req.body.cartItems,
  )
  res.send("done")

  // Order.create(data, (err, createdOrders) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).send("Error creating orders");
  //   }

  //   // `createdOrders` will contain the newly created orders with MongoDB-generated _id
  //   console.log("Orders created:", createdOrders);
  //   res.send("done");
  // });
})

app.post('/emptyCartItems', async (req, res)=>{
  console.log("dsafsdf", req.body)
   await Cart.deleteMany({buyer_email: req.body.buyer_email})
  res.send("Deleted");
})





app.post('/addAddress', async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const addressDetails = req.body.addressDetails;
    user.address.push(addressDetails); // Add the new address to the user's address array

    await user.save(); // Save the updated user document

    res.send('Address added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/getUserAddresses', async (req, res) => {
  try {
    const email = req.body.email;

    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const addresses = user.address;

    res.send(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/removeProduct', async(req, res)=>{
  console.log(req.body)
    const ress = await Products.deleteOne({ _id: req.body.product_id})
    res.send("deleted");
  })


app.get('/getAllOrders', async (req, res)=>{
  const data = await Order.find()
  res.send(data)
})

app.get('/getVendors', async(req, res)=>{
  const data = await Users.find({role:"vendor"})
  res.send(data)
})

app.post('/changeStatus', async(req, res)=>{
  console.log(req.body)
  const user = await Users.findOne({_id:req.body.id});
  user.disabled = req.body.disabled
  await user.save();
  res.send(req.body.disabled)
})

app.post('/changeOrderStatus', async (req, res)=>{
  const order = await Order.findOne({_id:req.body.id});
  order.status = req.body.value;
  order.save();
  res.send("done")

})


app.post('/getMyOrders', async(req, res)=>{
  const data = await Order.find({buyer_email:req.body.email})
  res.send(data);
})


app.post('/getMyProductOrders', async (req, res)=>{
  const data = await Order.find({vendor_email:req.body.vendor_email})
  console.log(data)
  res.send(data)
})

app.listen(5000, () => {
  console.log("server started");
});
