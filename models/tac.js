const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/terminal`,{useMongoClient:true});
mongoose.Promise = global.Promise;
const mongooseToCsv = require('mongoose-to-csv');

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

tacSchema.plugin(mongooseToCsv,{
  headers: 'TAC 品牌1 型号1 可信度1 新可信度1 品牌2 型号2 可信度2 新可信度2 品牌3 型号3 可信度3 新可信度3 品牌4 型号4 可信度4 新可信度4 品牌5 型号5 可信度5 新可信度5 品牌6 型号6 可信度6 新可信度6 品牌7 型号7 可信度7 新可信度7',
  constraints:{
    'TAC':'TAC',
    '品牌1': '品牌1',
    '型号1': '型号1',
    '可信度1': '可信度1',
    '新可信度1': '新可信度1',
    '品牌2': '品牌2',
    '型号2': '型号2',
    '可信度2': '可信度2',
    '新可信度2': '新可信度2',
    '品牌3': '品牌3',
    '型号3': '型号3',
    '可信度3': '可信度3',
    '新可信度3': '新可信度3',
    '品牌4': '品牌4',
    '型号4': '型号4',
    '可信度4': '可信度4',
    '新可信度4': '新可信度4',
    '品牌5': '品牌5',
    '型号5': '型号5',
    '可信度5': '可信度5',
    '新可信度5': '新可信度5',
    '品牌6': '品牌6',
    '型号6': '型号6',
    '可信度6': '可信度6',
    '新可信度6': '新可信度6',
    '品牌7': '品牌7',
    '型号7': '型号7',
    '可信度7': '可信度7',
    '新可信度7': '新可信度7',
  }
});

tacSchema.statics.getTacId = function(query,callback){
  this.find({$or:query},{_id:1},callback)
};

tacSchema.statics.saveUploadTac = function(doc,callback){
  this.insert(doc,callback)
};

tacSchema.statics.updateTac = async function(docs){
  const histories = [];


  for (let doc of docs){
    let history ={before:[], after:[]};
    const {_id,..._after} = doc;
    const _before = await this.findByIdAndUpdate({_id},_after);
    const keys= Object.keys(_after);
    for(let key of keys){
      if(_before[key] !== _after[key]){
        history.before.push({[key]: _before[key]});
        history.after.push({[key]:_after[key]});
      }
    }
    if(history.after.length !== 0) histories.push(history);
  }
  return histories;
};

tacSchema.statics.createTac = async function(docs){
  return this.create(docs)
};

module.exports = mongoose.model('tac',tacSchema,'tac');
