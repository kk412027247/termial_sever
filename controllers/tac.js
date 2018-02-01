const tacModel = require('../models/tac');
const authModel = require('../models/auth');
const spiderController = require('./spider.js');

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


//app端用的路由
exports.createTacWithImage = (req, res) =>{
  (async ()=>{
    //console.log(req.body);
    const result = await tacModel.createTacWithImage(req);
    const userName = req.session.userInfo.userName;

     //如果是数据库不存的数据，就新增一条个人历史
    if(result.status === 'saved'){
      await authModel.history(userName, {
        status:'saved',
        ...result,
        date:new Date()
      });
      await spiderController.handleSpider([req.body.brand+' '+req.body.model]);
      return 'saved';
      
      //不是自己写入的话，缓存在个人中心
    }else if(result.auth!==userName){
      const check = await authModel.checkHistory(req);
      if(!!check) throw 'exist';
      await authModel.history(userName,{
        status:'cache',
        _id:result._id,
        "品牌1" : req.body.brand,
        "型号1" :req.body.model,
        TAC:Number(req.body.TAC),
        imagePath:req.file ? req.file.path : null,
        imageWidth:req.body.imageWidth ? req.body.imageWidth : null,
        imageHeight:req.body.imageHeight ? req.body.imageHeight : null,
        date:new Date()
      });
      return 'cache'
    }else if(result === 'imageIsToLarge'){
      throw  result
    }})()
    .then(success=>{
      //console.log(success);
      res.send(JSON.stringify(success))
    })
    .catch(err=>res.send(JSON.stringify(err)));
};

//如果在cache中找到的话，在APP中一定条件允许更新
exports.updateTacWithImage = (req, res) => {
  (async ()=>{
    const result = await tacModel.findOne({TAC: Number(req.body.TAC)});
    const userName = req.session.userInfo.userName;
    
    //如果是自己存的，则跳转录入页面,并修改
    if(result.auth === userName  ){
      await tacModel.deleteImageByTAC(req);
      await tacModel.updateTacWithImage(req);
      await authModel.updateUserHistory(req);

    }else{
      //其他条件，只修改个人中心里面的缓存数据
      await authModel.updateUserHistory(req);

    }
    return 'updated';
  })().then(success=>res.send(JSON.stringify(success)))
    .catch(err=>res.send(JSON.stringify(err)));
};

exports.deleteTacWithImage = (req, res) => {
  (async ()=>{
    await tacModel.deleteTacWithImage(req);
    await authModel.deleteTacWithImage(req);
    return 'delete'
  })().then(success=>res.send(JSON.stringify(success)))
    .catch(err=>res.send(JSON.stringify(err)))
};
