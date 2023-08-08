const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
app.use(cors());
app.use(express.json());
require("./userDetails");

const mongoUrl =
  "mongodb+srv://parvezislam45:qUUcnJDZwuBbBi8w@cluster0.vfvr7xt.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("david mongo connected");
  })
  .catch((e) => console.log(e));

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { fname,lname, email, password,userType } = req.body;
  const encryptedPassword = await bcrypt.hash(password,10)
  try {
    const oldUser = await User.findOne({email});
    if(oldUser){
       return res.send({error:"User Exists"})
    }
     await User.create({
      fname,lname,email,password:encryptedPassword,userType
    });
    console.log("New user registered:");
    res.send({ status: "Ok" });
  } catch (error) { 
    console.error("Error occurred while creating user:", error);
    res.send({ status: "Error" });
  }
});


app.post('/login',async (req,res) =>{
const {email,password}=req.body;
const user = await User.findOne({email});
if(!user){
    return res.json({error:"User  Not Found"})
}
if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
})

app.post("/userData", async (req, res) => {
    const { token } = req.body;
    try{
        const user = jwt.verify(token,JWT_SECRET)
        const userEmail = user.email;
        User.findOne({email : userEmail})
        .then((data)=>{
            res.send({status:"ok",data:data})
        })
        .catch((error)=>{
            res.send({status:"error",data:error})
        })
    }
    catch (error) { }
  });

app.listen(8000, () => {
  console.log("Server Running on Port 8000");
});
