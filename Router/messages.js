const express = require('express');
const router = express.Router();
const {authMiddleware}= require("../middleware/auth");
const messagesModel = require('../models/messages.model');
const chatRoomModel = require('../models/chatRoom.model');
const userModel = require('../models/user.model');
const complainerModel = require('../models/complainer.model');

// router.post("/complainertosupport",authMiddleware,async(req,res)=>{
//     try{
//         const {message}=req.body;  
        
//         const messages=new messagesModel({
//             message,
//            sender:req.user.id,        
            
            
//         });
//         await messages.save();
//         res.json(message).status(200);
//     }catch(err){
//         console.log(err);
//         res.status(500).json({message:"Internal server error"});
//      }

// })


// router.get('/',authMiddleware,async(req, res, next) => {
//     try {
//         const userId = req.user.id;
        
//         let messages = [];
      
       
//           messages = await  messagesModel.find({ sender: userId })
//             .populate({ path: 'receiver', model: 'Staff' });
//         console.log(messages)
      
//         res.json(messages).status(200);
//     } catch (err) {
//       next(err);
//     }
//   });

  router.get('/',authMiddleware,async(req, res, next) => {
    try {
        let chatRooms;
        
        if (req.user.role === 'complainer') {
          // If user, find or create chat room
          console.log("in");
          chatRooms = await chatRoomModel.findOne({ complainer: req.user.id }).populate('complainer user').populate({
            path: 'messages.sender',
            model:'Complainer',
            
          });;
          if (!chatRooms) {
            return res.status(401).json({message:"Chatroom not found"})
          }
        } else {
          // If staff, find chat room assigned to them
          const query= req.user.role==="member"? {user:req.user.id} : {}
          chatRooms = await chatRoomModel.find (query).populate('complainer user').populate({
            path: 'messages.sender',
            model: 'User',
          });
         

          // Map through all chatRooms we fetched
        const populatedChatRooms = await Promise.all(chatRooms.map(async (chatRoom) => {

  // For each chatRoom, map through its messages array
        const populatedMessages = await Promise.all(chatRoom.messages.map(async (msg) => {

    // Determine whether the sender is a User or a Staff based on senderModel field
        const Model = msg.senderModel === 'Complainer' ? complainerModel : userModel;

    // Fetch full sender details (name, email, etc.) from User or Staff collection
        const sender = await Model.findById(msg.sender);

    // Return the message object along with full sender details
        return { ...msg.toObject(), sender };
  }));

  // Convert the chatRoom (which is a Mongoose document) into a plain JavaScript object
  chatRoom = chatRoom.toObject();

  // Replace the chatRoom's messages with the newly populated messages (which now include full sender data)
  chatRoom.messages = populatedMessages;

  // Return the modified chatRoom
  return chatRoom;
}));

// After processing all chatRooms, send the final result as a JSON response
chatRooms = populatedChatRooms;

        
        }
      console.log(chatRooms);
        res.json(chatRooms)
       // Return the array of message
    } 
    catch (err) {
      next(err);
    }
  });

   router.post("/complainerToSupport",authMiddleware,async(req,res)=>{
    try{
     const {message}=req.body;
     const admins = await userModel.find({ role: 'admin' });
     let chatRoom = await chatRoomModel.findOne({ complainer: req.user.id });
    
     if(!chatRoom){
       console.log(req.user.role)
        if(req.user.role==='complainer'){
            
              chatRoom = new chatRoomModel({
                complainer: req.user.id,
                user: admins.map(admin => admin.id)
            });   
                       
        }      
      }    
  
     chatRoom.messages.push({ message, sender: req.user.id, senderModel: 'Complainer' });
     
     await chatRoom.save();
     console.log(chatRoom)
     res.json(chatRoom).status(200);
    }
    catch(err){
      
      res.status(500).json({message:"Internal server error"}); 
    }
  })


  router.post("/supportToComplainer",authMiddleware,async(req,res)=>{
    try{
     const {message}=req.body;
     const chatRoom = await chatRoomModel.findOne({ user: req.user.id });
     if(!chatRoom)
     {
        return res.status(401).json({message:"Chatroom not found"})
     }    
     chatRoom.messages.push({ message, sender: req.user.id, senderModel: 'User' });
     await chatRoom.save();
     res.json(chatRoom).status(200);
    }
    catch(err){
      console.log(err);
      res.status(500).json({message:"Internal server error"}); 
    }
  })
  router.post('/:id/messages', authMiddleware, async (req, res) => {
    const chatRoom = await chatRoomModel.findById(req.params.id);
    if (!chatRoom) return res.status(404).send('Chatroom not found');
  
    chatRoom.messages.push({
      message: req.body.message,
      sender: req.user._id,
      senderModel: 'User',
    });
  
    await chatRoom.save();
    res.sendStatus(200);
  });

  router.patch('/:id/status', authMiddleware, async (req, res) => {
    const { status } = req.body;

  const updated = await chatRoomModel.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('complainer user');

  if (!updated) return res.status(404).json({ message: 'Chatroom not found' });

  res.json(updated);
  })





  router.post('/assignChat', authMiddleware, async (req, res) => {
    // Only allow if user is an admin
    if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  
    const { chatRoomId, userId } = req.body;
  
    try {
      
      const userMember = await userModel.findById(userId);
      if (!userMember) return res.status(404).send('Staff not found');
  
     
      const chatRoom = await chatRoomModel.findById(chatRoomId);
      if (!chatRoom) return res.status(404).send('Chat room not found');
  
      
      if (!chatRoom.user.includes(userId)) {
        chatRoom.user.push(userId);
        await chatRoom.save();
      }
  
      res.status(200).send('Staff assigned successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error assigning staff');
    }
  });



module.exports=router;