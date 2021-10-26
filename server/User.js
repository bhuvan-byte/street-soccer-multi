const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  usernames:{
    type: Array,
    default: []
  },
  visits: {
    type: Array,
    default: []
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model('User', UserModelSchema);

module.exports = UserModel;
