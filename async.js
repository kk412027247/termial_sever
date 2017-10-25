const mongoose = require('mongoose');
const charset = require ('superagent-charset');
const superAgent = charset(require('superagent'));
const cheerio = require('cheerio');

//mongoose的promise对象是不被建议使用的，建议用系统同自带的promise对象
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test', { useMongoClient: true });
const MyModel = mongoose.model('Test', new mongoose.Schema({name: String})) ;


async function run(){

  const res = await superAgent.get('http://mobile.zol.com.cn/').charset();
  const $1 = cheerio.load(res.text);
  
  // const obj  = $1('#manu-switc-1 ul li .title a');
  // const arr = Array.from(obj);
  // arr.map(item=>MyModel.create({name:item.attribs.href}));
  const list = await MyModel.find();

  list.map();

  console.log(list);
  
}







run().catch(console.log);



