const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const messagesSchema=new Schema({
    message:{
        type:"String",
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        
        refPath: 'senderModel'
      },
     
  senderModel: String,

  createdAt: { type: Date, default: Date.now },
    
}

)

module.exports = messagesSchema;