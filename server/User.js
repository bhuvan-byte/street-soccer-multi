const mongoose = require('mongoose');

const UserModelSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true
  },
  recentIp:{
    type: String,
    required: false
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
    default: function(){
      return new Date(new Date().getTime() + (new Date().getTimezoneOffset() + 330)*60000).toString();
    }
  }
});

const UserModel = mongoose.model('User', UserModelSchema);

module.exports = UserModel;
