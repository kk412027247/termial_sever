const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/terminal`,{useMongoClient: true});
mongoose.Promise = global.Promise;

const authSchema = new mongoose.Schema({
  'userName':String,
  'passWord':{type:String, default:'123'},
  'level':{type:Number, default:1, enum:[1,2,3]},
  'history':Array
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
    {$push:{history: doc }}
  )
};

authSchema.statics.getHistory = async function(req){
  return this.findOne({
    userName:req.session.userInfo.userName,
    'history.TAC':req.body.TAC,
  })
};

authSchema.statics.updateUserHistory = async function(req){
  return this.update({
    userName:req.session.userInfo.userName,
    'history.TAC':req.body.TAC,
  },{
    $set:{
      //修改数组中的值
      'history.$.brand':req.body.brand,
      'history.$.model':req.body.model,
      'history.$.imagePath':req.file ? req.file.path : undefined,
    }
  })
};

authSchema.statics.searchHistory = async function(req){
  return this.findOne({
    userName:req.session.userInfo.userName,
    'history.TAC':req.body.TAC
  });
};

module.exports = mongoose.model('auth',authSchema);

