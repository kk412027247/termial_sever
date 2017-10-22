const express = require('express');
const router = express.Router();

const charset = require ('superagent-charset');
const superAgent = charset(require('superagent'));
const cheerio =require('cheerio');


// 引入mongoose
const mongoose = require('mongoose');

// 设置mongodb服务器
//,{useMongoClient:true} 是什么鬼
mongoose.connect('mongodb://localhost/terminal',{useMongoClient:true} );

//mongoose.connect('mongodb://localhost/terminal');

// 数据库2
// const mongoose2 = require('mongoose');
// const db2 = mongoose.connect('mongodb://localhost/info');




//定义Schema

const terminalSchema = new mongoose.Schema({
  '价格': String,
  "是否支持GPS": Boolean,
  "是否支持NFC": Boolean,
  "是否支持FR": Boolean,
  "是否触摸屏": Boolean,
  "是否支持多点触摸": Boolean,
  "屏幕个数": Number,
  "是否支持快速充电": Boolean,
  "卡槽数量": Number,
  "通讯录是否支持名片式号码簿": Boolean,
  "是否支持蓝牙": Boolean,
  "WIFI": Boolean,
  "是否支持网络热点": Boolean,
  "厂商": String,
  "品牌(英文)": String,
  "型号": String,
  "子型号": String,
  "上市时间": String,
  "市场定位": String,
  "是否智能机": Boolean,
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
  date:{type:Date, default:Date.now}
});

// schema备用属性
//terminalSchema.add({author: String, body: String});

const terminalMode = mongoose.model('terminal',terminalSchema);

router.get('/', function(req, res, next) {
  terminalMode.find({},(err,docs)=>{
    if(err)console.log(err);
    res.send(docs) ;
  })
});

router.get('/search',(req, res)=>{
  terminalMode.find({$text:{$search:"runoob"}}, (err, docs) => {
    if (err) console.log(err);
    res.send(docs);
  });
});

router.get('/info',(req,res)=>{
  res.send('123123')
});

router.post('/query',(req,res)=>{
  console.log(req.body.query);
  terminalMode.find({$text: {$search: req.body.query}},(err, doc)=>{
    if(err) console.log(err);
    res.send(doc)
  });
});



router.post('/add',function(req, res){
  terminalMode.create(req.body,(err,docs)=>{
    if(err)console.log(err);
    console.log(docs)
  });
  res.send(req.body)
});

router.post('/find',function(req,res){
  terminalMode.find({brand:req.body.brand},(err,docs)=>{
    if(err)console.log(err);
    res.send(docs);
  });
  console.log(req.body);
});

//session 传值 ,session的值只保存在服务器。
router.get('/sign',(req,res)=>{
  req.session.user='user';
  req.session.cookie.maxAge = 1000*60*60*24*14;
  res.send(JSON.stringify('注册成功'));
});

//session 验证登陆
router.get('/log',(req,res)=>{
  req.session.user === 'user' ?  res.send(JSON.stringify('登陆成功')) : res.send(JSON.stringify('登陆失败'));
});


// session 清除
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.send(JSON.stringify('已经退出'))
});




// 从zol主页获取最新手机信息
router.get('/getList',(req, res)=>{
  superAgent.get('http://mobile.zol.com.cn/')
  .charset()
  .then((success)=>{
    const $ = cheerio.load(success.text);
    $('#manu-switc-1 ul li .title a').each((index, element)=>{
      superAgent.get($(element).attr('href'))
      .charset()
      .then((success)=>{
        const $ = cheerio.load(success.text);
        let hrefParam =  $('#_j_tag_nav .nav__list li').eq(3).find('a').attr('href');
        let href = 'http://detail.zol.com.cn'+hrefParam;
        superAgent.get(href)
        .charset()
        .then((success)=>{
          const $ = cheerio.load(success.text);
          //存入数据库
          terminalMode.create({
            brand: $('.version-box span').text(),
            screen: $('#mParam ul li').eq(0).find('p').eq(0).attr('title') ,
            resolution: $('#mParam ul li').eq(0).find('p').eq(1).attr('title') ,
            battery: $('#mParam ul li').eq(2).find('p').eq(0).attr('title'),
            batteryCapacity: $('#mParam ul li').eq(2).find('p').eq(1).attr('title'),
            rearCamera: $('#mParam ul li').eq(1).find('p').eq(0).attr('title'),
            frontCamera:  $('#mParam ul li').eq(1).find('p').eq(1).attr('title'),
            cpu:  $('#mParam ul li').eq(3).find('p').eq(0).attr('title'),
            memory:  $('#mParam ul li').eq(3).find('p').eq(1).attr('title')
          },(err)=>{
            if(err) console.log('从首页存入失败'+err);
          });
        })
      });
    });
    res.send('1')
  })
});



//用手机型号进行信息查询
router.post('/getInfo',(req, res)=>{
  terminalMode.find({brand: {$regex: req.body.brand, $options:'i'}} ,(err, doc)=>{
    if(err) console.log(err);
    res.send(doc);
 })
});

// promise ?
router.get('/promise',(req, res)=>{
  let arr = [];
  superAgent
  .get('https://www.baidu.com/')
  .charset()
  .then(
    superAgent
    .get('https://www.so.com1/')
    .then((success)=>console.log(success.text))
  )
  .then(
    superAgent
    .get('https://www.sogou.com1/')
    .then((success)=>console.log(success.text))
  )
  .then((success)=>res.send(success))
  .catch(err=>res.send(err))
});

router.get('/getDetail',(req, res)=>{
  const list = {};
  const list2 = {};
  list2['是否支持GPS'] = false;
  list2['是否支持NFC'] = false;
  list2['是否支持FR'] = false ;
  list2['是否触摸屏'] = false ;
  list2['是否支持多点触摸'] = false;
  list2['屏幕个数'] = 1 ;
  list2['是否支持快速充电'] = false;
  list2['卡槽数量'] = 1;
  list2['通讯录是否支持名片式号码簿']=true;
  list2['通讯录是否支持名片式号码簿']=true;
  list2['是否支持蓝牙'] = false;
  list2['WIFI'] = false;
  list2['是否支持网络热点'] = false;

  superAgent.get('http://detail.zol.com.cn/cell_phone/index1104332.shtml')
  .charset()
  .then(success=>{
    const $ = cheerio.load(success.text);
    let price = $('#_j_local_price a.price').text();
    list2['价格'] = price;
    console.log(list2['价格']);
    list['价格'] = price;
  });
  

  const detail = [];

  let url1 = 'http://detail.zol.com.cn/1105/1104332/param.shtml';
  let url2 =  'http://detail.zol.com.cn/1162/1161851/param.shtml' ;
  let url3 =  'http://detail.zol.com.cn/1166/1165069/param.shtml';
  let url4 = 'http://detail.zol.com.cn/395/394162/param.shtml';
  let url5 = 'http://detail.zol.com.cn/1155/1154728/param.shtml';

  superAgent.get(url1)
  .charset()
  .then((success)=>{
    const $ = cheerio.load(success.text);

    //品牌+型号+价格
    list['厂商'] = $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
    list['型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');
    list2['厂商'] = $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
    list2['品牌(英文)'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');
    list2['型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');
    list2['子型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');

    


    $('#newTb table li span').each((index, element)=>{
      if($(element).text() !== '') detail.push($(element).text())
    });

    detail.forEach((item, index)=> {
      if(index % 2 === 0) list[item] = detail[index + 1]
    });

    detail.forEach((item, index)=> {
      switch(item){
        case '支持频段':
          list2['支持TD-LTE频段'] = detail[index + 1].match(/TD-LTE\s([^\\]+)\n/)[1];
          list2['频段'] = detail[index + 1];
          break ;
        case '4G网络':
          list2['网络制式'] =  detail[index + 1];
          list2['终端支持能力'] = detail[index + 1];
          list2['是否支持FR'] = true;
          break ;
        case '3G网络':
          list2['网络制式'] = list2['网络制式'] ? list2['网络制式'] + detail[index + 1] : detail[index + 1];
          list2['终端支持能力'] = list2['网络制式'] ? list2['网络制式'] + detail[index + 1] : detail[index + 1];
          break ;
        case '导航':
          list2['是否支持GPS'] = detail[index + 1].includes('GPS');
          break;
        case '连接与共享' :
          list2['是否支持NFC'] = detail[index + 1].includes('NFC');
          list2['蓝牙协议集'] = detail[index + 1].match(/(蓝牙[^\，]+)/)[1];
          list2['是否支持蓝牙'] = detail[index + 1].includes('蓝牙');
          list2['支持的蓝牙版本'] = detail[index + 1].match(/(蓝牙[^\，]+)/)[1];
          break;
        case 'CPU型号':
          list2['CPU芯片型号(ARM版本)'] = detail[index + 1];
          break;
        case '手机尺寸':
          list2['机长(mm)'] = detail[index + 1].match(/(^[^x]+)/)[1];
          list2['机宽(mm)'] = detail[index + 1].match(/x([^x]+)x/)[1];
          list2['机厚(mm)'] = detail[index + 1].match(/x([^x]+)mm$/)[1];
          break;
        case '手机重量':
          list2['重量(g)'] = detail[index + 1].replace(/g/,'');
          break;
        case '造型设计':
          list2['外观'] = detail[index + 1].replace(/g/,'');
          break;
        case '手机类型':
          list2['市场定位'] = detail[index + 1];
          list2['是否智能机'] = detail[index + 1].includes('智能');
          list2['是否支持快速充电'] = detail[index + 1].includes('快充');
          break;
        case '上市日期':
          list2['上市时间'] = detail[index + 1];
          break;
        case '核心数':
          list2['CPU数量'] = detail[index + 1];
          break;
        case 'CPU型号':
          list2['CPU厂家'] = detail[index + 1].match(/^([\S]+)/)[1];
          list2['CPU型号'] = detail[index + 1];
          break;
        case '触摸屏类型':
          list2['是否触摸屏'] = true;
          list2['触摸屏类型'] = detail[index + 1];
          list2['是否支持多点触摸'] = detail[index + 1].includes('多点');
          break;
        case '副屏参数':
          list2['屏幕个数'] = 2;
          break;
        case '主屏尺寸':
          list2['主屏大小(英寸)'] = detail[index + 1];
          break;
        case '主屏分辨率':
          list2['主屏分辨率(横)'] = detail[index + 1].match(/([\d]+)x/)[1];
          list2['主屏分辨率(纵)'] = detail[index + 1].match(/x([\d]+)/)[1];
          break;
        case '主屏材质':
          list2['主屏材质'] = detail[index + 1];
          break;
        case '屏幕像素密度':
          list2['屏幕像素密度'] = detail[index + 1];
          break;
        case '机身接口':
          list2['充电器接口'] = detail[index + 1].replace(/^[^\，]+\，/, '');
          list2['耳机接口类型'] = detail[index + 1].includes('耳机')? detail[index + 1].match(/(^[^\，]+)\，/)[1] : undefined;
          break;
        case '电池容量':
          list2['电池容量'] = detail[index + 1];
          break;
        case '理论待机时间':
          list2['待机时间'] = detail[index + 1];
          break;
        case '理论通话时间':
          list2['通话时间'] = detail[index + 1];
          break;
        case '操作类型':
          list2['操作类型'] = detail[index + 1];
          break;
        case 'SIM卡':
          list2['SIM卡'] = detail[index + 1];
          break;
        case '摄像头类型':
          list2['摄像头'] = detail[index + 1];
          break;
        case '后置摄像头':
          list2['后置摄像头'] = detail[index + 1];
          break;
        case '前置摄像头':
          list2['前置摄像头'] = detail[index + 1];
          break;
        case '闪光灯':
          list2['闪光灯'] = detail[index + 1];
          break;
        case '拍照功能':
          list2['拍照功能'] = detail[index + 1];
          break;
        case '视频拍摄':
          list2['视频拍摄'] = detail[index + 1];
          break;
        case '操作系统':
          list2['操作系统'] = detail[index + 1];
          break;
        case 'RAM容量':
          list2['RAM容量'] = detail[index + 1];
          break;
        case 'ROM容量':
          list2['ROM容量'] = detail[index + 1];
          break;
        case '存储卡':
          list2['存储卡'] = detail[index + 1];
          break;
        case '扩展容量':
          list2['扩展容量'] = detail[index + 1];
          break;
        case 'WLAN功能':
          list2['WIFI'] = detail[index + 1].includes('WIFI');
          list2['WIFI支持协议'] = detail[index + 1];
          list2['是否支持网络热点'] = detail[index + 1].includes('WIFI');
          break;
      }
    });

    console.log(list2);
    res.send(list2);
  });

});



router.get('/getCnList',(req, res)=>{

  const list2 = {};
  const detail = [];
  list2['是否支持GPS'] = false;
  list2['是否支持NFC'] = false;
  list2['是否支持FR'] = false ;
  list2['是否触摸屏'] = false ;
  list2['是否支持多点触摸'] = false;
  list2['屏幕个数'] = 1 ;
  list2['是否支持快速充电'] = false;
  list2['卡槽数量'] = 1;
  list2['通讯录是否支持名片式号码簿']=true;
  list2['通讯录是否支持名片式号码簿']=true;
  list2['是否支持蓝牙'] = false;
  list2['WIFI'] = false;
  list2['是否支持网络热点'] = false;

  superAgent.get('http://mobile.zol.com.cn/')
    .charset()
    .then((success)=>{
      const $ = cheerio.load(success.text);
      $('#manu-switc-1 ul li .title a').each((index, element)=>{

        superAgent.get($(element).attr('href'))
          .charset()
          .then((success)=>{
            const $ = cheerio.load(success.text);
            let hrefParam =  $('#_j_tag_nav .nav__list li').eq(3).find('a').attr('href');
            let href = 'http://detail.zol.com.cn'+hrefParam;
            list2['价格'] = $('#_j_local_price a.price').text();
            //console.log(list2['价格']);

            console.log(href);

            superAgent.get(href)
              .charset()
              .then((success)=>{
                const $ = cheerio.load(success.text);

                //品牌+型号+价格
                list2['厂商'] = $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
                list2['品牌(英文)'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list2['厂商']),'');
                list2['型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list2['厂商']),'');
                list2['子型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list2['厂商']),'');

                $('#newTb table li span').each((index, element)=>{
                  if($(element).text() !== '') detail.push($(element).text())
                });

                // detail.forEach((item, index)=> {
                //   if(index % 2 === 0) list2[item] = detail[index + 1]
                // });

                detail.forEach((item, index)=> {
                  switch(item){
                    case '支持频段':
                      list2['支持TD-LTE频段'] = detail[index + 1].match(/TD-LTE\s([^\\]+)\n/)[1];
                      list2['频段'] = detail[index + 1];
                      break ;
                    case '4G网络':
                      list2['网络制式'] =  detail[index + 1];
                      list2['终端支持能力'] = detail[index + 1];
                      list2['是否支持FR'] = true;
                      break ;
                    case '3G网络':
                      list2['网络制式'] = list2['网络制式'] ? list2['网络制式'] + detail[index + 1] : detail[index + 1];
                      list2['终端支持能力'] = list2['网络制式'] ? list2['网络制式'] + detail[index + 1] : detail[index + 1];
                      break ;
                    case '导航':
                      list2['是否支持GPS'] = detail[index + 1].includes('GPS');
                      break;
                    case '连接与共享' :
                      list2['是否支持NFC'] = detail[index + 1].includes('NFC');
                      //list2['蓝牙协议集'] = detail[index + 1].match(/(蓝牙[^\，]+)/)[1];
                      list2['是否支持蓝牙'] = detail[index + 1].includes('蓝牙');
                      //list2['支持的蓝牙版本'] = detail[index + 1].match(/(蓝牙[^\，]+)/)[1];
                      break;
                    case 'CPU型号':
                      list2['CPU芯片型号(ARM版本)'] = detail[index + 1];
                      break;
                    case '手机尺寸':
                      list2['机长(mm)'] = detail[index + 1].match(/(^[^x]+)/)[1];
                      list2['机宽(mm)'] = detail[index + 1].match(/x([^x]+)x/)[1];
                      list2['机厚(mm)'] = detail[index + 1].match(/x([^x]+)mm$/)[1];
                      break;
                    case '手机重量':
                      list2['重量(g)'] = detail[index + 1].replace(/g/,'');
                      break;
                    case '造型设计':
                      list2['外观'] = detail[index + 1].replace(/g/,'');
                      break;
                    case '手机类型':
                      list2['市场定位'] = detail[index + 1];
                      list2['是否智能机'] = detail[index + 1].includes('智能');
                      list2['是否支持快速充电'] = detail[index + 1].includes('快充');
                      break;
                    case '上市日期':
                      list2['上市时间'] = detail[index + 1];
                      break;
                    case '核心数':
                      list2['CPU数量'] = detail[index + 1];
                      break;
                    case 'CPU型号':
                      list2['CPU厂家'] = detail[index + 1].match(/^([\S]+)/)[1];
                      list2['CPU型号'] = detail[index + 1];
                      break;
                    case '触摸屏类型':
                      list2['是否触摸屏'] = true;
                      list2['触摸屏类型'] = detail[index + 1];
                      list2['是否支持多点触摸'] = detail[index + 1].includes('多点');
                      break;
                    case '副屏参数':
                      list2['屏幕个数'] = 2;
                      break;
                    case '主屏尺寸':
                      list2['主屏大小(英寸)'] = detail[index + 1];
                      break;
                    case '主屏分辨率':
                      list2['主屏分辨率(横)'] = detail[index + 1].match(/([\d]+)x/)[1];
                      list2['主屏分辨率(纵)'] = detail[index + 1].match(/x([\d]+)/)[1];
                      break;
                    case '主屏材质':
                      list2['主屏材质'] = detail[index + 1];
                      break;
                    case '屏幕像素密度':
                      list2['屏幕像素密度'] = detail[index + 1];
                      break;
                    case '机身接口':
                      list2['充电器接口'] = detail[index + 1].replace(/^[^\，]+\，/, '');
                      list2['耳机接口类型'] = detail[index + 1].includes('耳机')? detail[index + 1].match(/(^[^\，]+)\，/)[1] : undefined;
                      break;
                    case '电池容量':
                      list2['电池容量'] = detail[index + 1];
                      break;
                    case '理论待机时间':
                      list2['待机时间'] = detail[index + 1];
                      break;
                    case '理论通话时间':
                      list2['通话时间'] = detail[index + 1];
                      break;
                    case '操作类型':
                      list2['操作类型'] = detail[index + 1];
                      break;
                    case 'SIM卡':
                      list2['SIM卡'] = detail[index + 1];
                      break;
                    case '摄像头类型':
                      list2['摄像头'] = detail[index + 1];
                      break;
                    case '后置摄像头':
                      list2['后置摄像头'] = detail[index + 1];
                      break;
                    case '前置摄像头':
                      list2['前置摄像头'] = detail[index + 1];
                      break;
                    case '闪光灯':
                      list2['闪光灯'] = detail[index + 1];
                      break;
                    case '拍照功能':
                      list2['拍照功能'] = detail[index + 1];
                      break;
                    case '视频拍摄':
                      list2['视频拍摄'] = detail[index + 1];
                      break;
                    case '操作系统':
                      list2['操作系统'] = detail[index + 1];
                      break;
                    case 'RAM容量':
                      list2['RAM容量'] = detail[index + 1];
                      break;
                    case 'ROM容量':
                      list2['ROM容量'] = detail[index + 1];
                      break;
                    case '存储卡':
                      list2['存储卡'] = detail[index + 1];
                      break;
                    case '扩展容量':
                      list2['扩展容量'] = detail[index + 1];
                      break;
                    case 'WLAN功能':
                      list2['WIFI'] = detail[index + 1].includes('WIFI');
                      list2['WIFI支持协议'] = detail[index + 1];
                      list2['是否支持网络热点'] = detail[index + 1].includes('WIFI');
                      break;
                  }
                });
                terminalMode.create(list2 ,(err)=>{
                  if(err) console.log('从首页存入失败'+err);
                });
                console.log(list2);

              });

          });
      });
      res.send('1')
    })
});




module.exports = router;
