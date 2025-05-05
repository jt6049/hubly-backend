const express = require('express');
const router = express.Router();
const {authMiddleware}= require("../middleware/auth");
const complainerModel = require('../models/complainer.model');
const jwt = require('jsonwebtoken');
router.post("/",async(req,res,next)=>{
    try {
        const { name,phone,email } = req.body;
        let complainer = await complainerModel.findOne({ email });
        if(!complainer){
           complainer = new complainerModel({
                name,
                phone,
                email,
            });
        }
        
        await complainer.save();
        const payload ={
            id:complainer._id,
            name:complainer.name,
            role:complainer.role,
          };
          const token=jwt.sign(payload,"secret");
          console.log(token)
        
        res.json({token,complainer}).status(200);   
        
      } catch (err) {
        next(err);
      }
})





module.exports=router;