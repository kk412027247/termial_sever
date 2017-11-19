const mongoose = require('mongoose');
const host = require('../host');
mongoose.connect(`mongodb://${host.mongoose}/terminal`,{useMongoClient: true});
mongoose.Promise = global.Promise;

const authSchema = new mongoose.Schema({
  'userName':String,
  'passWord':{type:String,default:'123'},
  'level':{type:Number, default:1},
});

authSchema.statics.signIn = function(info, callback){
  this.findOne(info,callback)
};

authSchema.statics.register = function(info,callback){
  this.create(info,callback)
};

authSchema.statics.changePassword = function(info,callback){
  const {newPassWord, ...query} = info;
  this.update(query,{$set:{passWord:newPassWord}},callback)
};

module.exports = mongoose.model('auth',authSchema);

