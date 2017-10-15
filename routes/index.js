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



module.exports = router;
