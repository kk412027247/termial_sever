const tacModel = require('../models/tac');


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

