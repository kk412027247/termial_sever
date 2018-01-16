const tacModel = require('../models/tac');
const authModel = require('../models/auth');
const spiderController = require('./spider.js');
const fs = require('fs');
const fsAsync = (path)=>(
  new Promise((resolve,reject)=>{
    fs.readFile(path,(err,data)=>{
      if(err){reject (err)}else{resolve (data)}
    })
  })
);

const createImage = (buffer,file) => {
  new Promise((resolve,reject)=>{
    fs.writeFile('./uploads/'+Date.now()+file.originalname.match(/\.[^.]+$/),buffer,err=>{
      if(err){ reject(err)}else{ resolve(fs.unlink(file.path,err=>err))}
    })
  })
};



exports.getTacId = (req, res)=>{
 tacModel.getTacId(req.body,(err,doc)=>{
   if(err) {
     console.log(err);
     res.send(err);
   }else{
     res.send(doc);
   }
 })
};

exports.saveUploadTac = (req, res)=>{
  req.body.docArr.forEach(tacInfo=>{
    (async ()=>{
      const check = await tacModel.find({'TAC':tacInfo['TAC']});
      if(!check) await tacModel.create(tacInfo);
      if(!!check) await console.log('data exist',tacInfo);
    })()
  });
  res.send(JSON.stringify('存储中'))
};

exports.updateTac = (req, res) => {
  (async ()=>{
    const histories = await tacModel.updateTac(req.body.docs);
    if(histories.length === 0) throw('nothing change');
    return authModel.updateHistory(req.session.userInfo.userName, histories);
  })().then((result)=>res.send(result))
    .catch(err=>res.send(JSON.stringify(err)));
};

exports.createTac = (req, res)=>{
  (async ()=>{
    await tacModel.createTac(req.body.docs);
    //手机品牌和型号提取出来，
    const queries = [];
    for(let query of req.body.docs){
      queries.push(query['品牌1']+query['型号1'])
    }
    //把关键词抽成数组，提交到爬虫里
    await spiderController.handleSpider(queries);
    return authModel.updateHistory(req.session.userInfo.userName, {before:'' ,after:docs})
  })().then(success=>res.send(success))
    .catch(err=>res.send(err));
};



exports.createTacWithImage = (req, res) =>{
  (async ()=>{
    const imageBuffer = await fsAsync(req.file.path);
    await tacModel.create({...req.body, image:imageBuffer});
    const image = (await tacModel.findOne({'TAC':333232323232323})).image;
    await createImage(image,req.file);
    res.send(JSON.stringify('上传成功了'))
  })()
};
