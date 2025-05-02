const express = require('express');
const router = express.Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10);//taking the passsword and then storing it in encrypted format
      const user = new userModel({
        firstName,
        lastName ,
        email, 
        password: hashedPassword,
      });
      await user.save();
      res.json({ message: 'User registered successfully' }).status(200);
    } catch (err) {
      next(err);
    }
  });


  router.post("/login",async(req,res,next)=>{
    try{
      const {email,password}=req.body;
      const user=await userModel.findOne({email});
      if(!user){
        return res.status(401).json({Message:"Invalid credentials"});
      }
      const isPasswordCorrect=await bcrypt.compare(password,user.password);//comparing password with user password.
      if(!isPasswordCorrect){
        return res.status(401).json({message:"Invalid credentials"})
      }
      const payload ={
        id:user._id,
        name:user.name,
        role:user.role,
      };
      const token=jwt.sign(payload,"secret");//creation of token, payload contains data to whose token is needed
      res.json({token,message:"Login successful"}).status(200);//sending token
    }
    catch(err){
      next(err)
    }
  })


  module.exports=router;