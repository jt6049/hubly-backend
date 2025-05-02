const mongoose = require('mongoose');
const messagesSchema = require('./messages.model');
const chatRoomSchema = new mongoose.Schema({
    complainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Complainer' },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }],
    messages: [messagesSchema],
    status:{
        type:String,
        enum:['unresolved','resolved'],
        default:'unresolved',
    }
  });
module.exports = mongoose.model('ChatRoom', chatRoomSchema);
  