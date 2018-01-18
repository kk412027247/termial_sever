const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/terminal`,{useMongoClient: true});
mongoose.Promise = global.Promise;

const authSchema = new mongoose.Schema({
  'userName':String,
  'passWord':{type:String,default:'123'},
  'level':{type:Number, default:1, enum:[1,2,3]},
  'history':{type:Array, default:[]},
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

authSchema.statics.updateHistory= async function(userName, histories){
  return this.update(
    {userName},
    {$push: {'history': histories}},
  );
};

authSchema.statics.history = async function(userName,doc){
  return  this.update(
    {userName},
    {$push:{history: doc}}
  )
};

module.exports = mongoose.model('auth',authSchema);

