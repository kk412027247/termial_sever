const mongoose = require('mongoose');
const fs = require("fs");
//const authModel = require('./tac');
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
    {$push:{
      history:{
        $each:[doc],
        $sort:{date:-1},
        $slice:30,
    }}}
  )
};

authSchema.statics.updateUserHistory = async function(req){
  //删除缓存中的 记录占照片
  const file = await this.findOne({
    userName:req.session.userInfo.userName,
    history:{$elemMatch:{
        status:'cache',
        TAC:Number(req.body.TAC),
      }}
  },{
    'history.$':1,
    _id:0
  });

  if(file && file.history[0].imagePath){
    fs.unlink('./'+file.history[0].imagePath,(err)=>{
      if(err)console.log(err);
    })
  }
  
  await this.update({
    userName:req.session.userInfo.userName,
    'history.TAC':Number(req.body.TAC),
  },{
    $set:{
      'history.$.型号1':req.body.brand,
      'history.$.品牌1':req.body.model,
      'history.$.imagePath':req.file ? req.file.path : null,
      'history.$.imageWidth':req.body.imageWidth ? req.body.imageWidth : null,
      'history.$.imageHeight':req.body.imageHeight ? req.body.imageHeight : null,
      'history.$.date':new Date()
    },
  });
  return this.update({
      userName:req.session.userInfo.userName
  },{
    $push:{history:{$each:[],$sort:{date:-1}}}
  })
};

// 搜索个人中心记录
authSchema.statics.searchUserHistory = async function(req){
  //console.log(req);
  return this.findOne({
    userName:req.session.userInfo.userName,
    'history.TAC':req.body.TAC
  },{
    'history.$':1,
    _id:0
  });
};

authSchema.statics.checkHistory = async function(req){
  return this.findOne({
    userName:req.session.userInfo.userName,
    'history.TAC':Number(req.body.TAC)
  })
};


//历史记录获取获取
authSchema.statics.getUserHistory = async function(req){
  return this.findOne({
    userName:req.session.userInfo.userName
  },{
    //控制返回数组的长度，以及跳过的数量
    userName:0, level:0, passWord:0, history:{$slice:[req.query.skip*3, 3]}
  })
};

authSchema.statics.deleteTacWithImage = async function(req){
  //删除缓存中的 记录占照片
  const file = await this.findOne({
    userName:req.session.userInfo.userName,
    history:{$elemMatch:{
      status:'cache',
      TAC:Number(req.body.TAC),
    }}
  },{
    'history.$':1,
    _id:0
  });

  if(file && file.history[0].imagePath){
    fs.unlink('./'+file.history[0].imagePath,(err)=>{
      if(err)console.log(err);
    })
  }
 
  await this.update({
    userName:req.session.userInfo.userName
  },{
    $pull:{history:{TAC:Number(req.body.TAC)}}
  })
};


authSchema.statics.getUserHistoryByPC = async function(req){
  return this.findOne({
    userName:req.session.userInfo.userName
  },{ userName:0, level:0, passWord:0, history:{$slice:[req.query.skip*10, 10]}})
};

authSchema.statics.getUserHistoryLength = async function(req){
  const history = await this.findOne({
    userName:req.session.userInfo.userName
  },{
    history:1
  });
  if(!!history){
    return history.length;
  }else{
    return 0
  }
};

authSchema.statics.updateHistoryByPC = async function(req){
  //先把自己和其他用户的记录更新
  if(req.body.status === 'saved'){
    await this.updateOne({
      history: {$elemMatch: {status: 'saved', TAC: req.body.TAC}}
    },{
      $pull: {history: {TAC: req.body.TAC}}
    });
    await this.updateOne({
      userName:req.session.userInfo.userName,
      'history.TAC':req.body.TAC,
    },{
      $set:{
        'history.$.status':'saved',
        'history.$.date': new Date(),
      }
    });
    await this.updateOne({
      userName:req.session.userInfo.userName
    },{
      $push:{history:{$each:[],$sort:{date:-1}}}
    });
    return this.findOne({
        
    })
  }else{
    return this.updateOne({
      userName:req.session.userInfo.userName,
    },{
      $pull:{history:{TAC:Number(req.body.TAC)}}
    })
  }
};


module.exports = mongoose.model('auth',authSchema);

