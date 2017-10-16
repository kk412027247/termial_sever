const express = require('express');
const router = express.Router();

const charset = require ('superagent-charset');
const superAgent = charset(require('superagent'));
const cheerio =require('cheerio');


// 引入mongoose
const mongoose = require('mongoose');

// 设置mongodb服务器
mongoose.connect('mongodb://localhost/terminal' ,{useMongoClient:true});

// 数据库2
// const mongoose2 = require('mongoose');
// const db2 = mongoose.connect('mongodb://localhost/info');




//定义Schema

const terminalSchema = new mongoose.Schema({
  '厂商':String,
  "型号":String,
  "上市日期":String,
  "手机类型":String,
  "触摸屏类型":String,
  "主屏尺寸":String,
  "主屏材质":String,
  "主屏分辨率":String,
  "屏幕像素密度":String,
  "屏幕技术":String,
  "窄边框":String,
  "屏幕占比":String,
  "其他屏幕参数":String,
  "4G网络":String,
  "3G网络":String,
  "SIM卡":String,
  "":String,
  "双频WIFI，IEEE 802.11 a/b/g/n/ac":String,
  "GPS导航，A-GPS技术，GLONASS导航":String,
  "WLAN热点，蓝牙4.1":String,
  "操作系统":String,
  "核心数":String,
  "CPU型号":String,
  "CPU频率":String,
  "GPU型号":String,
  "RAM容量":String,
  "ROM容量":String,
  "存储卡":String,
  "电池类型":String,
  "电池容量":String,
  "其他硬件参数":String,
  "摄像头类型":String,
  "后置摄像头":String,
  "前置摄像头":String,
  "传感器类型":String,
  "传感器型号":String,
  "闪光灯":String,
  "光圈":String,
  "摄像头特色":String,
  "视频拍摄":String,
  "拍照功能":String,
  "造型设计":String,
  "机身颜色":String,
  "手机尺寸":String,
  "手机重量":String,
  "操作类型":String,
  "感应器类型":String,
  "指纹识别设计":String,
  "机身接口":String,
  "其他外观参数":String,
  brand:String,
  screen:String,
  resolution:String,
  battery:String,
  batteryCapacity:String,
  rearCamera:String,
  frontCamera:String,
  cpu:String,
  memory:String,
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

router.get('/info',(req,res)=>{
  res.send('123123')
});



router.post('/',function(req, res){
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
  const basic = [];
  const monitor = [];
  const network = [];
  const hardware = [];
  const camera = [];
  const outside = [];

  let url1 = 'http://detail.zol.com.cn/1105/1104332/param.shtml';
  let url2 =  'http://detail.zol.com.cn/1162/1161851/param.shtml' ;
  let url3 =  'http://detail.zol.com.cn/1166/1165069/param.shtml';
  let url4 = 'http://detail.zol.com.cn/395/394162/param.shtml';
  let url5 = 'http://detail.zol.com.cn/1155/1154728/param.shtml';

  superAgent.get(url5)
  .charset()
  .then((success)=>{
    const $ = cheerio.load(success.text);

    //品牌+型号
    list['厂商'] = $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
    list['型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');

    // 基本参数
    $('#newTb table').eq(0).find('li').find('span').each(
      (index, element)=>{basic.push($(element).text())}
    );

    basic.forEach((item, index)=>{
      if(index % 2 === 0) list[item]=basic[index+1]
    });

    //屏幕
    $('#newTb table').eq(1).find('li').find('span').each(
      (index, element) => monitor.push($(element).text())
    );

    monitor.forEach((item, index)=>{
      if(index % 2 === 0) list[item]=monitor[index+1]
    });

    //网络
    $('#newTb table').eq(2).find('li').find('span').each(
      (index, element) => network.push($(element).text())
    );

    network.forEach((item, index)=>{
      if(index % 2 === 0) list[item]=network[index+1]
    });

    //硬件
    $('#newTb table').eq(3).find('li').find('span').each(
      (index, element) => hardware.push($(element).text())
    );

    hardware.forEach((item, index)=>{
      if(index % 2 === 0) list[item]=hardware[index+1]
    });

    //摄像头
    $('#newTb table').eq(4).find('li').find('span').each(
      (index, element) => camera.push($(element).text())
    );

    camera.forEach((item, index)=>{
      if(index % 2 === 0) list[item]=camera[index+1]
    });

    // 外观
    $('#newTb table').eq(5).find('li').find('span').each(
      (index, element)=> outside.push($(element).text())
    );

    outside.forEach((item, index)=>{
      if(index % 2 === 0) list[item]=outside[index+1]
    });

    res.send(list);
  });

});



router.get('/getCnList',(req, res)=>{

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
            console.log(href);

            const list = {};
            const basic = [];
            const monitor = [];
            const network = [];
            const hardware = [];
            const camera = [];
            const outside = [];

            superAgent.get(href)
            .charset()
            .then((success)=>{
              const $ = cheerio.load(success.text);

              //品牌+型号
              list['厂商'] = $('.breadcrumb a').eq(2).text().replace(/手机/ig,'');
              list['型号'] = $('#page-title').text().match(/(.+)\（/)[1].replace(new RegExp(list['厂商']),'');

              // 基本参数
              $('#newTb table').eq(0).find('li').find('span').each(
                (index, element)=>{basic.push($(element).text())}
              );

              basic.forEach((item, index)=>{
                if(index % 2 === 0) list[item]=basic[index+1]
              });

              //屏幕
              $('#newTb table').eq(1).find('li').find('span').each(
                (index, element) => monitor.push($(element).text())
              );

              monitor.forEach((item, index)=>{
                if(index % 2 === 0) list[item]=monitor[index+1]
              });

              //网络
              $('#newTb table').eq(2).find('li').find('span').each(
                (index, element) => network.push($(element).text())
              );

              network.forEach((item, index)=>{
                if(index % 2 === 0) list[item]=network[index+1]
              });

              //硬件
              $('#newTb table').eq(3).find('li').find('span').each(
                (index, element) => hardware.push($(element).text())
              );

              hardware.forEach((item, index)=>{
                if(index % 2 === 0) list[item]=hardware[index+1]
              });

              //摄像头
              $('#newTb table').eq(4).find('li').find('span').each(
                (index, element) => camera.push($(element).text())
              );

              camera.forEach((item, index)=>{
                if(index % 2 === 0) list[item]=camera[index+1]
              });

              // 外观
              $('#newTb table').eq(5).find('li').find('span').each(
                (index, element)=> outside.push($(element).text())
              );

              outside.forEach((item, index)=>{
                if(index % 2 === 0) list[item]=outside[index+1]
              });

              console.log(list);

              terminalMode.create(list ,(err)=>{
                if(err) console.log('从首页存入失败'+err);
              });
            });
          });
      });
      res.send('1')
    })
});




module.exports = router;
