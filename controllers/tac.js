const tacModel = require('../models/tac');


exports.query = (req, res)=>{
 tacModel.query(req.body,(err,doc)=>{
   if(err) {
     console.log(err)
   }else{
     res.send(doc);
   }
 })
};
