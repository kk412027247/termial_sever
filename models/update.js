const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/terminal`,{useMongoClient: true});
mongoose.Promise = global.Promise;

const updateSchema = new mongoose.Schema({
  author:String,
  beforeUpdate:Array,
  afterUpdate:Array,
  date:{type:Date, default:Date.now()}
});


module.exports = mongoose.model('update',updateSchema);
