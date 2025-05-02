const mongoose = require('mongoose');
const ComplainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        
   },
   role:{
    type: String,
    enum:['complainer'],
    default:'complainer',
   },
   createdAt: { type: Date, default: Date.now },
  

})
module.exports = mongoose.model('Complainer', ComplainerSchema);