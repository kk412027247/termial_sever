const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/terminal',{useMongoClient:true});
mongoose.Promise = global.Promise;


const getListSchema = new mongoose.Schema({
  'tac':String,
  '厂商(中文)':String,
  '品牌(英文)':String,
  '型号':String,
  '子型号':String,
  '机长(mm)':String,
  '机宽(mm)':String,
  '机厚(mm)':String,
  '重量(g)':String,
  '外观':String,
  '市场定位':String,
  '市场价格':String,
  '上市时间':String,
  '终端支持能力':String,
  '终端支持能力子项':String,
  '是否智能机':String,
  '是否支持FR':String,
  'LTE设备是否支持CSFB':String,
  'LTE设备是否支持单卡双待':String,
  'TD-LTE-Category等级':String,
  '是否支持上行载波聚合':String,
  '上行载波聚合支持明细':String,
  '下行载波聚合支持明细':String,
  '是否支持下行载波聚合':String,
  '是否支持VOLTE':String,
  'VoLTE是否支持语音通话':String,
  'VoLTE是否支持视频通话':String,
  'CPU数量':String,
  'CPU厂家':String,
  'CPU型号':String,
  'CPU芯片型号(ARM版本)':String,
  'CPU时钟频率(MHz)':String,
  '是否触摸屏':String,
  '触摸屏类型':String,
  '是否支持多点触摸':String,
  '屏幕个数':String,
  '主屏大小(英寸)':String,
  '主屏分辨率(横)':String,
  '主屏分辨率(纵)':String,
  '主屏材质':String,
  '主屏色深':String,
  '充电器接口':String,
  '耳机接口类型':String,
  '输入':String,
  '电池容量':String,
  '是否支持快速充电':String,
  '待机时间(小时)':String,
  '通话时间(小时)':String,
  '键盘类型':String,
  '卡槽数量':String,
  'SIM卡类型':String,
  '是否支持双卡双待':String,
  '双卡制式':String,
  '双卡SIM卡IMEI是否相同':String,
  '是否支持OTA':String,
  'SIM卡电压':String,
  '摄像头':String,
  '摄像头像素(万像素)':String,
  '微距镜头':String,
  '补光灯个数':String,
  '闪光灯个数':String,
  '图像分辨率':String,
  '照相功能':String,
  '图像格式':String,
  '视频分辨率':String,
  '视频帧数(fps)':String,
  '操作系统':String,
  '操作系统版本':String,
  '操作系统子版本':String,
  '软件版本(最新)':String,
  '开发平台':String,
  '平台提供商':String,
  '平台版本':String,
  '数字基带':String,
  '物理层和协议栈软件':String,
  '模拟基带和射频':String,
  '手机存储空间大小':String,
  'RAM大小':String,
  'ROM大小':String,
  '用户可使用的最大内存空间':String,
  '存储卡类型':String,
  '存储卡最大容量':String,
  '通讯录是否支持名片式号码簿':String,
  '通讯录是否支持分组管理':String,
  '网络制式':String,
  '制式等级':String,
  'USSD':String,
  '频段':String,
  '是否支持蓝牙':String,
  '支持的蓝牙版本':String,
  '蓝牙协议集':String,
  'WIFI':String,
  'WIFI支持协议':String,
  '是否支持红外':String,
  'USB接口版本':String,
  '是否支持网络热点':String,
  'HDMI接口类型':String,
  'HDMI接口版本':String,
  '数据接口类型':String,
  '是否支持GPS':String,
  'WAP版本':String,
  '是否支持NFC':String,
  '是否支持彩信':String,
  '是否支持Java':String,
  '支持的图像格式':String,
  '支持的声音格式':String,
  '是否有独立扬声器':String,
  '是否支持mp3':String,
  '播放器支持的音乐格式':String,
  '播放器支持的视频格式':String,
  '支持的邮件协议':String,
  '流媒体下载':String,
  '流媒体支持的声音格式':String,
  '流媒体支持的视频格式':String,
  '是否支持动态内存':String,
  '支持TD-LTE频段':String,
  '是否支持录音功能':String,
  '解锁方式':String,
  '关机闹铃':String,
  '重力感应':String,
  '距离感应器器':String,
  '电子罗盘':String,
  'FM收音机':String,
  '光线感应器':String,
  '长短信':String,
  '手机自带短信回执':String,
  '短信群发':String,
  'MM客户端':String,
  '手机阅读':String,
  '无线城市':String,
  'G-plus游戏包':String,
  '游戏':String,
  '是否支持显示附着状态':String,
  '是否支持显示激活状态':String,
  '是否支持显示数据传输':String,
  '全称':String,
  'url': String,
  date:{type:Date, default:Date.now},
  'author': String,
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

getListSchema.statics.updates = function(update, callback){
  console.log(update._id);
  this.update({_id:update._id},update,callback)
};



module.exports = mongoose.model('terminal',getListSchema);
