const updateModel = require('../models/update');


exports.getUpdateHistory = (req, res)=>{
  // updateModel.getUpdateHistory(req.body,(err,doc)=>{
  //   console.log('err',err);
  //   if(!err){
  //     res.send(doc)
  //   }else{
  //     res.send(JSON.stringify(err))
  //   }
  // })
  (async ()=>{
    const page = await updateModel.find({
      author:{$regex:req.body.author},
      date:{$gte:new Date(req.body.startDate),$lt:new Date(req.body.endDate)}
    },{__v:0}).count();

    const doc = await updateModel.find({
      author:{$regex:req.body.author},
      date:{$gte:new Date(req.body.startDate),$lt:new Date(req.body.endDate)}
    },{__v:0}).limit(20).skip(20*req.body.skip);

    await res.send({page:Math.ceil(page/20),doc})
  })()



};
