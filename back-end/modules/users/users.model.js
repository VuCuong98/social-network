const mongoose = require('mongoose');

// fullName
// description
// avatarUrl
// backgroundUrl
// isVerified
// passwordResetToken
// email
// password
const UserSchema = new mongoose.Schema({
  fullName: {
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires : {
    type: Date,
  },
  description: {
    type: String,
    default: '',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  backgroundUrl: {
    type: String,
    default: '',
  },
  
 
}, {
  timestamps: true,
});

const UsersModel = mongoose.model('User', UserSchema);

module.exports = UsersModel;