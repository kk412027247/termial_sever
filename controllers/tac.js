const tacModel = require('../models/tac');
const authModel = require('../models/auth');
const spiderController = require('./spider.js');
// const fs = require('fs');


// const createImage = (buffer,file) => {
//   new Promise((resolve,reject)=>{
//     fs.writeFile('./uploads/'+Date.now()+file.originalname.match(/\.[^.]+$/),buffer,err=>{
//       if(err){ reject(err)}else{ resolve(fs.unlink(file.path,err=>err))}
//     })
//   })
// };



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



const fsAsync = (path)=>(
  new Promise((resolve,reject)=>{
    fs.readFile(path,(err,data)=>{
      if(err){
        reject (err)
      }else{
        fs.unlink(path,err=>{if(err)console.log(err)});
        resolve (data);
      }
    })
  })
);

const createCache = async (req) =>{
  if(req.file){
    if(req.file.size < 16*1024*1024){
      const imageBuffer = await fsAsync(req.file.path);
      return {
        '品牌1':req.body.brand,
        '型号1':req.body.model,
        'TAC':req.body.TAC,
        image:imageBuffer,
        auth:req.session.userInfo.userName,
      };
    }
  }else{
    return {
      '品牌1':req.body.brand,
      '型号1':req.body.model,
      'TAC':req.body.TAC,
      image:req.body.image,
      auth:req.session.userInfo.userName,
    };
  }
};


//app端用的路由
exports.createTacWithImage = (req, res) =>{
  (async ()=>{
    const result = await tacModel.createTacWithImage(req);
 
     //如果是数据库不存的数据，就新增一条
    if(result.status === 'saved'){
      const cache = await createCache(req);
      await authModel.history(req.session.userInfo.userName, {
        status:'saved',
        tacDoc:result._id,
        date:new Date(),
        ...cache,
      }) ;
      return spiderController.handleSpider([req.body['品牌1']+' '+req.body['型号1']]);

      //不是自己写入的话，或者不是自己当天写入，缓存在个人中心
    }else if(result.auth!==req.session.userInfo.userName || new Date(new Date().toLocaleDateString()) > result.data){
      const cache = await createCache(req);
      return authModel.history(req.session.userInfo.userName,{
        status:'noSaved',
        tacDoc:result._id,
        date:new Date(),
        ...cache,
      });

      //如果是自己存的，并且是当天存入的，则跳转到修改页面
    }else if(result.auth===req.session.userInfo.userName && new Date(new Date().toLocaleDateString()) <= result.data ){
      const cache = await createCache(req);
      return authModel.history(req.session.userInfo.userName,{
        status:'reWrite',
        tacDoc:result._id,
        date:new Date(),
        ...cache,
      });
    }else if(result === 'imageIsToLarge'){
      throw  result
    }})()
    .then(success=>res.send(JSON.stringify(success)))
    .catch(err=>res.send(JSON.stringify(err)))
};
