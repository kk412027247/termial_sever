const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/terminal',{useMongoClient:true});

const getListSchema = new mongoose.Schema({
  '全称':String,
  'generalUrl': String,
  'url': String,
  '价格': String,
  "是否支持GPS": Number,
  "是否支持NFC": Number,
  "是否支持FR": Number,
  "是否触摸屏": Number,
  "是否支持多点触摸": Number,
  "屏幕个数": Number,
  "是否支持快速充电": Number,
  "卡槽数量": Number,
  "通讯录是否支持名片式号码簿": Number,
  "是否支持蓝牙": Number,
  "WIFI": Number,
  "是否支持网络热点": Number,
  "厂商": String,
  "品牌(英文)": String,
  "型号": String,
  "子型号": String,
  "上市时间": String,
  "市场定位": String,
  "是否智能机": Number,
  "触摸屏类型": String,
  "主屏大小(英寸)": String,
  "主屏材质": String,
  "主屏分辨率(横)": String,
  "主屏分辨率(纵)": String,
  "屏幕像素密度": String,
  "网络制式": String,
  "终端支持能力": String,
  "支持TD-LTE频段": String,
  "频段": String,
  "SIM卡": String,
  "WIFI支持协议": String,
  "蓝牙协议集": String,
  "支持的蓝牙版本": String,
  "操作系统": String,
  "CPU数量": String,
  "CPU芯片型号(ARM版本)": String,
  "RAM容量": String,
  "ROM容量": String,
  "电池容量": String,
  "通话时间": String,
  "待机时间": String,
  "摄像头": String,
  "后置摄像头": String,
  "前置摄像头": String,
  "闪光灯": String,
  "视频拍摄": String,
  "拍照功能": String,
  "外观": String,
  "机长(mm)": String,
  "机宽(mm)": String,
  "机厚(mm)": String,
  "重量(g)": String,
  "操作类型": String,
  "充电器接口": String,
  '双卡双待':Number,
  '操作系统版本':String,
  'CSFB':Number,
  '单卡双待':Number,
  '上行载波聚合':Number,
  '上行载波聚合': Number,
  'VOLTE':Number,
  date:{type:Date, default:Date.now}
});

// this 这里指的是model,操作数据库用的，这是官方的教程写法。

//爬虫新增
getListSchema.statics.getList = function(list, callback){
  this.findOne({'厂商':list['厂商']},(err, doc)=>{
    if(err){
      console.log("出错啦")
    }else if(!doc){
      this.create(list ,callback);
      console.log('存进去了');
    }else{
      console.log('数据重复了,不存了')
    }
  });

};





//更改
getListSchema.statics.updateList = function(query, newDoc){
  this.update(query, newDoc,{multi: true},(err, doc)=>{
    console.log(doc);
  })
};


//检查是否存在
getListSchema.statics.check = function(query){
  this.findOne(query,(err,doc)=>{
    console.log(doc)
  })
};

//前台查询
getListSchema.statics.query = function (query,callback){
  console.log(query);
  this.find({$text:{$search: query}},callback)
};



module.exports = mongoose.model('terminal',getListSchema);
