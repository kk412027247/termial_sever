const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/terminal`,{useMongoClient: true});
mongoose.Promise = global.Promise;

const updateSchema = new mongoose.Schema({
  brand:String,
  author:String,
  beforeUpdate:Array,
  afterUpdate:Array,
  date:{type:Date, default:(Date.now()+8*60*60*1000)}
});


updateSchema.statics.getUpdateHistory = function(query,callback){
  this.find({
    author:{$regex:query.author},
    date:{$gte:new Date(query.startDate),$lt:new Date(query.endDate)}
  },{__v:0}, callback).limit(20).skip(20*query.skip)
};

module.exports = mongoose.model('update',updateSchema);
