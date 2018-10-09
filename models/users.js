var mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

mongoose.Promise = global.Promise;

var UserSchema = mongoose.Schema({
  username: {type: String, required: true},
  email:{type: String, unique: true, required: true},
  emailConfirmed: Boolean,
  confirmToken: String,
  confirmExpires: Date,
  password: String,
  local: Boolean,
  facebook: {
    id: String,
    token: String
  },
  google: {
    id: String,
    token: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  proteinList: [String],
  carbList: [String],
  dairyList: [String],
  vegList: [String],
  fruitList: [String],
  miscList:[String],
});
UserSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
module.exports = mongoose.model("User", UserSchema);
