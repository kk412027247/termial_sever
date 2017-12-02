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


module.exports = mongoose.model('update',updateSchema);
