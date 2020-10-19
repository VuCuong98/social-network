const mongoose = require('mongoose');

// fullName
// description
// avatarUrl
// email
// password
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  avatarUrl: {
    type: String,
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
}, {
  timestamps: true,
});

const UsersModel = mongoose.model('User', UserSchema);

module.exports = UsersModel;