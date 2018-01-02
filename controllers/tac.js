const tacModel = require('../models/tac');
const authModel = require('../models/auth');

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
    return authModel.updateHistory(eq.session.userInfo.userName,{before:'',after:docs})
  })().then(success=>res.send(success))
    .catch(err=>res.send(err));
};
