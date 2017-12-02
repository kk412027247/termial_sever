const tacModel = require('../models/tac');


exports.getTacId = (req, res)=>{
 tacModel.getTacId(req.body,(err,doc)=>{
   if(err) {
     console.log(err)
   }else{
     res.send(doc);
   }
 })
};

