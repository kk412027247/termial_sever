const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/terminal`,{useMongoClient:true});
mongoose.Promise = global.Promise;
const mongooseToCsv = require('mongoose-to-csv');
const fs = require('fs');
const doNoting = (...arg) => arg;

const tacSchema = new mongoose.Schema({
  "TAC" : Number,
  "品牌1" : String,
  "型号1" : String,
  "可信度1" : Number,
  "新可信度1" : Number,
  "品牌2" : String,
  "型号2" : String,
  "可信度2" : Number,
  "新可信度2" : Number,
  "品牌3" : String,
  "型号3" : String,
  "可信度3" : Number,
  "新可信度3" : Number,
  "品牌4" : String,
  "型号4" : String,
  "可信度4" : Number,
  "新可信度4" : Number,
  "品牌5" : String,
  "型号5" : String,
  "可信度5" : Number,
  "新可信度5" : Number,
  "品牌6" : String,
  "型号6" : String,
  "可信度6" : Number,
  "新可信度6" : Number,
  "品牌7" : String,
  "型号7" : String,
  "可信度7" : Number,
  "新可信度7" : Number,
  //图片认证,如果有图片地址，就为已经验证
  imagePath:String,
  imageWidth:Number,
  imageHeight:Number,
  auth:String,
  date:{type: Date, default: new Date()}
});

tacSchema.plugin(mongooseToCsv,{
  headers: 'TAC 品牌1 型号1 可信度1 新可信度1 品牌2 型号2 可信度2 新可信度2 品牌3 型号3 可信度3 新可信度3 品牌4 型号4 可信度4 新可信度4 品牌5 型号5 可信度5 新可信度5 品牌6 型号6 可信度6 新可信度6 品牌7 型号7 可信度7 新可信度7',
  constraints:{
    'TAC':'TAC',
    '品牌1': '品牌1',
    '型号1': '型号1',
    '可信度1': '可信度1',
    '新可信度1': '新可信度1',
    '品牌2': '品牌2',
    '型号2': '型号2',
    '可信度2': '可信度2',
    '新可信度2': '新可信度2',
    '品牌3': '品牌3',
    '型号3': '型号3',
    '可信度3': '可信度3',
    '新可信度3': '新可信度3',
    '品牌4': '品牌4',
    '型号4': '型号4',
    '可信度4': '可信度4',
    '新可信度4': '新可信度4',
    '品牌5': '品牌5',
    '型号5': '型号5',
    '可信度5': '可信度5',
    '新可信度5': '新可信度5',
    '品牌6': '品牌6',
    '型号6': '型号6',
    '可信度6': '可信度6',
    '新可信度6': '新可信度6',
    '品牌7': '品牌7',
    '型号7': '型号7',
    '可信度7': '可信度7',
    '新可信度7': '新可信度7',
  }
});

tacSchema.statics.getTacId = function(query,callback){
  this.find({$or:query},{_id:1},callback)
};

tacSchema.statics.saveUploadTac = function(doc,callback){
  this.insert(doc,callback)
};

tacSchema.statics.updateTac = async function(docs){
  const histories = [];
  for (let doc of docs){
    let history ={before:[], after:[]};
    const {_id, invalid, data,..._after} = doc;
    doNoting(invalid,data);
    const _before = await this.findByIdAndUpdate({_id},_after);
    const keys= Object.keys(_after);
    for(let key of keys){
      if(_before[key] !== _after[key]){
        history.before.push({[key]: _before[key]});
        history.after.push({[key]:_after[key]});
      }
    }
    if(history.after.length !== 0) histories.push(history);
  }
  return histories;
};




tacSchema.statics.createTac = async function(docs){
  return this.create(docs)
};

tacSchema.statics.createTacWithImage = async function(req){
  const check = await this.findOne({TAC: Number(req.body.TAC)});
  if(!!check) return check ;
  //console.log(req.body,req.file);
  const result = await this.create({
    '品牌1':req.body.brand,
    '型号1':req.body.model,
    'TAC':req.body.TAC,
    imagePath:req.file ? req.file.path : null,
    imageWidth:req.body.imageWidth ? req.body.imageWidth : null,
    imageHeight:req.body.imageHeight ? req.body.imageHeight : null,
    auth:req.session.userInfo.userName,
  });
  return {status:'saved',...result._doc}
};

tacSchema.statics.updateTacWithImage = async function(req){
  return this.update({TAC:req.body.TAC},{
    $set:{
      '品牌1':req.body.brand,
      '型号1':req.body.model,
      imagePath:req.file ? req.file.path : null,
      imageWidth:req.body.imageWidth ? req.body.imageWidth : null,
      imageHeight:req.body.imageHeight ? req.body.imageHeight : null,
    }
  })
};

tacSchema.statics.deleteTacWithImage = async function(req){
  const check = await this.findOne({TAC:req.body.TAC});
  if(check.auth === req.session.userInfo.userName){
    await this.remove({TAC:req.body.TAC});
    if(!check.imagePath) return;
    fs.unlink('./'+check.imagePath,(err)=>{
      if(err)console.log(err);
    });
  }
};

tacSchema.statics.deleteImageByTAC = async function(req){
  const file = await this.findOne({TAC:req.body.TAC},{imagePath:1,_id:0});
  if(file.imagePath){
    fs.unlink('./'+file.imagePath,(err)=>{
      if(err)console.log(err);
    })
  }
};

tacSchema.statics.updateHistoryByPC = async function(userName, doc){
  const {_id,status, ..._doc} = doc;
  doNoting(_id,status);
  const check = await this.findOne({TAC:doc.TAC});
  if(check.imagePath){
    fs.unlink('./'+check.imagePath,(err)=>{
      if(err)console.log(err);
    });
  }
  await this.updateOne({
    TAC:doc.TAC
  },{
    $set:{..._doc, auth: userName, date: new Date()}
  })
};


tacSchema.statics.updateTacWithImageByPC = async function(req){
  const curImage = (await this.findOne({_id:req.body._id})).imagePath;
  if(curImage){
    fs.unlink('./'+curImage,(err)=>{
      if(err)console.log(err);
    })}
  await this.findByIdAndUpdate(req.body._id,{
    $set:{
      imagePath:req.file.path,
      imageWidth:null,
      imageHeight:null,
    }
  });
};



tacSchema.statics.deleteTACImageByPC = async function(req){
  const image = (await this.findOne({_id:req.body._id})).imagePath;
  fs.unlink('./'+image,err=>console.log(err));
  await this.findByIdAndUpdate(req.body._id,{$set:{
    imagePath : null ,
    imageWidth : null,
    imageHeight : null,
  }})
};

module.exports = mongoose.model('tac',tacSchema,'tac');
