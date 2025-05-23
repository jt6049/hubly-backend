const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
 
})

module.exports = mongoose.model('User', userSchema);
