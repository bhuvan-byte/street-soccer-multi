const mongoose = require('mongoose');

const VisitModelSchema = new mongoose.Schema({
  ip:{
    type: String,
    required: true
  },
  // useragent:{
  //   type: String,
  //   required: true
  // },
  route:{
    type: String,
    required: true
  },
  referer:{
    type: String,
    required: false
  },
  dateTime:{
    type: Date,
    default: Date.now
  }
});

const UserModelSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  recentIp:{
    type: String,
    required: false
  },
  uniqueIps:{
    type: [String]
  },
  usernames:{
    type: Array,
    default: []
  },
  visits: {
    type: Object,
    default: {}
  },
  dateCreated: {
    type: String,
    default: function(){
      return new Date(new Date().getTime() + (new Date().getTimezoneOffset() + 330)*60000).toString();
    }
  }
});

const UserModel = mongoose.model('User', UserModelSchema);
const VisitModel = mongoose.model('Visit',VisitModelSchema);
module.exports.UserModel = UserModel;
module.exports.VisitModel = VisitModel;
