let express = require('express');
let router = express.Router();

// 引入mongoose
const mongoose = require('mongoose');
// 设置mongodb服务器
const db = mongoose.connect('mongodb://localhost/terminal');

// 数据库2
// const mongoose2 = require('mongoose');
// const db2 = mongoose.connect('mongodb://localhost/info');
// db.connection.on('open',()=>{
//   console.log('链接成功2')
// });


db.connection.on('error',(error)=>{
  console.log(error)
});
db.connection.on('open',()=>{
  console.log('链接成功')
});
db.connection.on('disconnected',()=>{
  console.log('disconnected')
});

//定义Schema

const terminalSchema = new mongoose.Schema({
  brand:String,
  model:String,
  size:Number,
  price:Number,
  resolution:String,
  backCamera:Number,
  fontCamera:Number,
  battery:Number,
  date:{type:Date, default:Date.now}
});

// schema备用属性
//terminalSchema.add({author: String, body: String});

const terminalMode = mongoose.model('terminal',terminalSchema);

router.get('/', function(req, res, next) {
  console.log(req.headers.authorization);
  terminalMode.find({},(err,docs)=>{
    if(err)console.log(err);
    res.send(docs)
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


// session 退出
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.send(JSON.stringify('已经退出'))
});




module.exports = router;
