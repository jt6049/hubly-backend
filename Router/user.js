const express = require('express');
const router = express.Router();
const {authMiddleware}= require("../middleware/auth");
const userModel = require('../models/user.model');

router.get("/",async(req,res,next)=>{
    try {
        const {id}=req.user;
        const user=await userModel.findById(id);//search by id 
        if(!user){
          return res.status(404).json({message:"User not found"});
        }
        res.json(user).status(200);
      } catch (err) {
        next(err);
      }
})


router.delete('/', authMiddleware,async(req, res, next) => {
    try {
      const {id}=req.user;
      const user=await userModel.findByIdAndDelete(id);//search by id 
      if(!user){
        return res.status(404).json({message:"User not found"});
      }
      res.json({message:"User deeted Successfully!"}).status(200);
    } catch (err) {
      next(err);
    }
  });

  router.put("/", authMiddleware ,async(req,res,next)=>{
    try{
      const{id}=req.user;
      const user=await userModel.findByIdAndUpdate(id,req.body);
      if(!user){  
        return res.status(404).json({message:"User not found"});
      }
      res.json(user).status(200);
  
    }catch (err) {
      next(err);
    }
  })


  router.post('/assign-member', authMiddleware, async (req, res) => {
    console.log(req.user.role);
    if (req.user.role !== 'admin') return res.status(403).send('Only admins can assign members');
  
    const { username,email,role } = req.body;
  
    const member = await userModel.findOne({ email, role: 'member' });
  
    if (!member) return res.status(404).send('Member not found');
  
    if (member.createdBy) return res.status(400).send('Member already assigned to another admin');
  
    member.createdBy = req.user.id;
    if (role === 'admin') {
      member.role = 'admin';
      member.createdBy = null; // Admins manage themselves
    }
    await member.save();
  
    res.json(member).status(200);
  });

  router.get('/get-members', authMiddleware, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).send('Only admins can view their team');
  console.log(req.user.id);
    try {
      // Fetch all staff where createdBy matches current admin's ID
      const members = await userModel.find({ createdBy: req.user.id });
      console.log(members);
      res.json(members);
    } catch (err) {
      console.log(err);
      res.status(500).json({message:"Internal server error"}); 
    }
  });



module.exports=router;