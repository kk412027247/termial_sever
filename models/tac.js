const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/terminal`,{useMongoClient:true});
mongoose.Promise = global.Promise;

const tacSchema = new mongoose.Schema({
  "TAC" : Number,
  "品牌1" : String,
  "型号1" : String,
  "可信度1" : Number,
  "新可信度1" : Number,
  "品牌2" : String,
  "型号2" : String,
  "可信度2" : Number,
  "新可信度2" : Number,
  "品牌3" : String,
  "型号3" : String,
  "可信度3" : Number,
  "新可信度3" : Number,
  "品牌4" : String,
  "型号4" : String,
  "可信度4" : Number,
  "新可信度4" : Number,
  "品牌5" : String,
  "型号5" : String,
  "可信度5" : Number,
  "新可信度5" : Number,
  "品牌6" : String,
  "型号6" : String,
  "可信度6" : Number,
  "新可信度6" : Number,
  "品牌7" : String,
  "型号7" : String,
  "可信度7" : Number,
  "新可信度7" : Number,
  data:{type:Date, default:Date.now}
});


tacSchema.statics.query = function(query,callback){
  this.find(query,{TAC:1,_id:0},callback)
};


module.exports = mongoose.model('tac',tacSchema,'tac');
