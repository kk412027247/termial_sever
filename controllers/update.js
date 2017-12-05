const updateModel = require('../models/update');


exports.getUpdateHistory = (req, res)=>{
  (async ()=>{
    const pages = await updateModel.find({
      author:{$regex:req.body.author},
      date:{$gte:new Date(req.body.startDate),$lt:new Date(req.body.endDate)}
    }).count();
    const skip = 20*req.body.skip >=0 ? 20*req.body.skip : 0;

    const doc = await updateModel.find({
      author:{$regex:req.body.author},
      date:{$gte:new Date(req.body.startDate),$lt:new Date(req.body.endDate)}
    },{__v:0}).limit(20).skip(skip).sort({date:-1});
    await res.send({pages:Math.ceil(pages/20),doc})
  })()
};
