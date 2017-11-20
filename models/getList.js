const mongoose = require('mongoose');
const host = require('../host');
mongoose.connect(`mongodb://${host.mongoose}/terminal`,{useMongoClient:true});
mongoose.Promise = global.Promise;
const mongooseToCsv = require('mongoose-to-csv');


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

getListSchema.plugin(mongooseToCsv, {
  headers: 'tac 厂商(中文) 品牌(英文) 型号 子型号 机长(mm) 机宽(mm) 机厚(mm) 重量(g) 外观 市场定位 市场价格 上市时间(年月，格式：YYYYMM) 终端支持能力 终端支持能力子项 是否智能机 是否支持FR LTE设备是否支持CSFB LTE设备是否支持单卡双待 TD-LTE Category等级 是否支持上行载波聚合 上行载波聚合支持明细 下行载波聚合支持明细 是否支持下行载波聚合 是否支持VOLTE VoLTE是否支持语音通话 VoLTE是否支持视频通话 CPU数量 CPU厂家 CPU型号 CPU芯片型号(ARM版本) CPU时钟频率(MHz) 是否触摸屏 触摸屏类型 是否支持多点触摸 屏幕个数 主屏大小(英寸) 主屏分辨率(横) 主屏分辨率(纵) 主屏材质 主屏色深 充电器接口 耳机接口类型 输入 电池容量 是否支持快速充电 待机时间(小时) 通话时间(小时) 键盘类型 卡槽数量 SIM卡类型 是否支持双卡双待 双卡制式 双卡SIM卡IMEI是否相同 是否支持OTA SIM卡电压 摄像头 摄像头像素(万像素) 微距镜头 补光灯个数 闪光灯个数 图像分辨率 照相功能 图像格式 视频分辨率 视频帧数(fps) 操作系统 操作系统版本 操作系统子版本 软件版本(最新) 开发平台 平台提供商 平台版本 数字基带 物理层和协议栈软件 模拟基带和射频 手机存储空间大小 RAM大小 ROM大小 用户可使用的最大内存空间 存储卡类型 存储卡最大容量 通讯录是否支持名片式号码簿 通讯录是否支持分组管理 网络制式 制式等级 USSD 频段 是否支持蓝牙 支持的蓝牙版本 蓝牙协议集 WIFI WIFI支持协议 是否支持红外 USB接口版本 是否支持网络热点 HDMI接口类型 HDMI接口版本 数据接口类型 是否支持GPS WAP版本 是否支持NFC 是否支持彩信 是否支持Java 支持的图像格式 支持的声音格式 是否有独立扬声器 是否支持mp3 播放器支持的音乐格式 播放器支持的视频格式 支持的邮件协议 流媒体下载 流媒体支持的声音格式 流媒体支持的视频格式 是否支持动态内存 支持TD-LTE频段 是否支持录音功能 解锁方式 关机闹铃 重力感应 距离感应器器 电子罗盘 FM收音机 光线感应器 长短信 手机自带短信回执 短信群发 MM客户端 手机阅读 无线城市 G-plus游戏包 游戏 是否支持显示附着状态 是否支持显示激活状态 是否支持显示数据传输 date author url _id',
  constraints: {
    'tac':'tac',
    "厂商(中文)":"厂商(中文)",
    "品牌(英文)":"品牌(英文)",
    "型号":"型号",
    "子型号":"子型号",
    "机长(mm)":"机长(mm)",
    "机宽(mm)":"机宽(mm)",
    "机厚(mm)":"机厚(mm)",
    "重量(g)":"重量(g)",
    "外观":"外观",
    "市场定位":"市场定位",
    "市场价格":"市场价格",
    "上市时间(年月，格式：YYYYMM)":"上市时间(年月，格式：YYYYMM)",
    "终端支持能力":"终端支持能力",
    "终端支持能力子项":"终端支持能力子项",
    "是否智能机":"是否智能机",
    "是否支持FR":"是否支持FR",
    "LTE设备是否支持CSFB":"LTE设备是否支持CSFB",
    "LTE设备是否支持单卡双待":"LTE设备是否支持单卡双待",
    "TD-LTE":"TD-LTE",
    "Category等级":"Category等级",
    "是否支持上行载波聚合":"是否支持上行载波聚合",
    "上行载波聚合支持明细":"上行载波聚合支持明细",
    "下行载波聚合支持明细":"下行载波聚合支持明细",
    "是否支持下行载波聚合":"是否支持下行载波聚合",
    "是否支持VOLTE":"是否支持VOLTE",
    "VoLTE是否支持语音通话":"VoLTE是否支持语音通话",
    "VoLTE是否支持视频通话":"VoLTE是否支持视频通话",
    "CPU数量":"CPU数量",
    "CPU厂家":"CPU厂家",
    "CPU型号":"CPU型号",
    "CPU芯片型号(ARM版本)":"CPU芯片型号(ARM版本)",
    "CPU时钟频率(MHz)":"CPU时钟频率(MHz)",
    "是否触摸屏":"是否触摸屏",
    "触摸屏类型":"触摸屏类型",
    "是否支持多点触摸":"是否支持多点触摸",
    "屏幕个数":"屏幕个数",
    "主屏大小(英寸)":"主屏大小(英寸)",
    "主屏分辨率(横)":"主屏分辨率(横)",
    "主屏分辨率(纵)":"主屏分辨率(纵)",
    "主屏材质":"主屏材质",
    "主屏色深":"主屏色深",
    "充电器接口":"充电器接口",
    "耳机接口类型":"耳机接口类型",
    "输入":"输入",
    "电池容量":"电池容量",
    "是否支持快速充电":"是否支持快速充电",
    "待机时间(小时)":"待机时间(小时)",
    "通话时间(小时)":"通话时间(小时)",
    "键盘类型":"键盘类型",
    "卡槽数量":"卡槽数量",
    "SIM卡类型":"SIM卡类型",
    "是否支持双卡双待":"是否支持双卡双待",
    "双卡制式":"双卡制式",
    "双卡SIM卡IMEI是否相同":"双卡SIM卡IMEI是否相同",
    "是否支持OTA":"是否支持OTA",
    "SIM卡电压":"SIM卡电压",
    "摄像头":"摄像头",
    "摄像头像素(万像素)":"摄像头像素(万像素)",
    "微距镜头":"微距镜头",
    "补光灯个数":"补光灯个数",
    "闪光灯个数":"闪光灯个数",
    "图像分辨率":"图像分辨率",
    "图像格式":"图像格式",
    "视频分辨率":"视频分辨率",
    "视频帧数(fps)":"视频帧数(fps)",
    "操作系统":"操作系统",
    "操作系统版本":"操作系统版本",
    "操作系统子版本":"操作系统子版本",
    "软件版本(最新)":"软件版本(最新)",
    "开发平台":"开发平台",
    "平台提供商":"平台提供商",
    "平台版本":"平台版本",
    "数字基带":"数字基带",
    "物理层和协议栈软件":"物理层和协议栈软件",
    "模拟基带和射频":"模拟基带和射频",
    "手机存储空间大小":"手机存储空间大小",
    "RAM大小":"RAM大小",
    "ROM大小":"ROM大小",
    "用户可使用的最大内存空间":"用户可使用的最大内存空间",
    "存储卡类型":"存储卡类型",
    "存储卡最大容量":"存储卡最大容量",
    "通讯录是否支持名片式号码簿":"通讯录是否支持名片式号码簿",
    "通讯录是否支持分组管理":"通讯录是否支持分组管理",
    "制式等级":"制式等级",
    "USSD":"USSD",
    "是否支持蓝牙":"是否支持蓝牙",
    "支持的蓝牙版本":"支持的蓝牙版本",
    "蓝牙协议集":"蓝牙协议集",
    "WIFI":"WIFI",
    "WIFI支持协议":"WIFI支持协议",
    "是否支持红外":"是否支持红外",
    "USB接口版本":"USB接口版本",
    "是否支持网络热点":"是否支持网络热点",
    "HDMI接口类型":"HDMI接口类型",
    "HDMI接口版本":"HDMI接口版本",
    "数据接口类型":"数据接口类型",
    "是否支持GPS":"是否支持GPS",
    "WAP版本":"WAP版本",
    "是否支持NFC":"是否支持NFC",
    "是否支持彩信":"是否支持彩信",
    "是否支持Java":"是否支持Java",
    "支持的图像格式":"支持的图像格式",
    "支持的声音格式":"支持的声音格式",
    "是否有独立扬声器":"是否有独立扬声器",
    "是否支持mp3":"是否支持mp3",
    "播放器支持的音乐格式":"播放器支持的音乐格式",
    "播放器支持的视频格式":"播放器支持的视频格式",
    "支持的邮件协议":"支持的邮件协议",
    "流媒体下载":"流媒体下载",
    "流媒体支持的声音格式":"流媒体支持的声音格式",
    "流媒体支持的视频格式":"流媒体支持的视频格式",
    "是否支持动态内存":"是否支持动态内存",
    "是否支持录音功能":"是否支持录音功能",
    "解锁方式":"解锁方式",
    "关机闹铃":"关机闹铃",
    "重力感应":"重力感应",
    "距离感应器器":"距离感应器器",
    "电子罗盘":"电子罗盘",
    "FM收音机":"FM收音机",
    "光线感应器":"光线感应器",
    "长短信":"长短信",
    "手机自带短信回执":"手机自带短信回执",
    "短信群发":"短信群发",
    "MM客户端":"MM客户端",
    "手机阅读":"手机阅读",
    "无线城市":"无线城市",
    "G-plus游戏包":"G-plus游戏包",
    "游戏":"游戏",
    "是否支持显示附着状态":"是否支持显示附着状态",
    "是否支持显示激活状态":"是否支持显示激活状态",
    "是否支持显示数据传输":"是否支持显示数据传输",
    'date':'date',
    'author':'author',
    'url':'url',
    '_id':'_id',
  },
  virtuals:{
    "频段":(doc)=>{
      if(doc["频段"] !== undefined){
        return doc["频段"].replace(/\n/g,'')
      }else{
        return doc["频段"]
      }
    },
    "支持TD-LTE频段":(doc)=>{
      if(doc["支持TD-LTE频段"] !== undefined){
        return doc["支持TD-LTE频段"].replace(/\n/g,'')
      }else{
        return doc["支持TD-LTE频段"]
      }
    },
    "网络制式":(doc)=>{
      if(doc["网络制式"] !== undefined){
        return doc["网络制式"].replace(/(\n)|(,)|(，)/g,'')
      }else{
        return doc["网络制式"]
      }
    },
    "照相功能":(doc)=>{
      if(doc["照相功能"] !== undefined){
        return doc["照相功能"].replace(/(\n)|(,)|(，)/g,'')
      }else{
        return doc["照相功能"]
      }
    },

    // "支持TD-LTE频段":(doc)=>(doc["支持TD-LTE频段"].replace(/\n/g,'')),
    // "网络制式":(doc)=>(doc["网络制式"].replace(/\n/g,'')),
  }
});


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
  //console.log(query);
  this.find({$text:{$search: query}},callback)
};

getListSchema.statics.updates = function(update, callback){
  //console.log(update._id);
  this.update({_id:update._id},update,callback)
};



module.exports = mongoose.model('terminal',getListSchema);
