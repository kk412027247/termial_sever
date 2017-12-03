const updateModel = require('../models/update');


exports.getUpdateHistory = (req, res)=>{
  console.log(req.body);
  updateModel.getUpdateHistory(req.body,(err,doc)=>{
    console.log('err',err);
    if(!err){
      res.send(doc)
    }else{
      res.send(JSON.stringify(err))
    }
  })
};
