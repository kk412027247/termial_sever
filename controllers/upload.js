const XLSX = require('xlsx');
const fs = require('fs');
const urlEncode = require('urlencode');
const superAgent = require('superagent');
require('superagent-charset')(superAgent);
const cheerio = require('cheerio');
const tacModel = require('../models/tac');
const headerArr = ['TAC','品牌1','型号1','可信度1','新可信度1','品牌2','型号2','可信度2','新可信度2','品牌3','型号3','可信度3','新可信度3','品牌4','型号4','可信度4','新可信度4','品牌5','型号5','可信度5','新可信度5','品牌6','型号6','可信度6','新可信度6','品牌7','型号7','可信度7','新可信度7'];
const userAgent =  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36';
const cookie = 'ip_ck=5sOD4vzxj7QuMTQyNTY2LjE1MDYwMDcwOTY%3D; listSubcateId=57; Adshow=2; visited_serachKw=vivo%20X20%7COPPO%20R11s%20Plus; lv=1512723492; vn=19; z_pro_city=s_provice%3Dguangdong%26s_city%3Dguangzhou; userProvinceId=30; userCityId=347; userCountyId=0; userLocationId=9; realLocationId=9; userFidLocationId=9; visited_subcateProId=57-1167243';
const search = 'http://detail.zol.com.cn/index.php?c=SearchList&subcateId=57&keyword=';




//form date 方式上传文件
//multer有single()中的名称必须是表单上传字段的name名称。
exports.uploadTac = (req, res)=>{
  //如果文件大小超过1M就不处理，大小我瞎定的。
  if(req.file.size > 1024*1024) {
    res.send(JSON.stringify('the file is too large'));
    return;
  }
  
  const workbook = XLSX.readFile(req.file.path);

  //以下方式可以获取整张表格，但是没有过滤每个单元格的内容，容易出错。
  // const sheet_name_list = workbook.SheetNames;
  // console.log(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));

  fs.unlinkSync(req.file.path);
  const sheetNames = workbook.SheetNames;
  const worksheet = workbook.Sheets[sheetNames[0]];

  const keys = Object.keys(worksheet);
  const headers = {};
  const data = [];
  const errMessage = [];


  //表格内容逐条过滤
  keys.filter(key => key[0] !== '!').forEach(key=>{
    const col = key.match(/([\D]+)/)[1];
    //如果因为列数从2开始，所以列数要-2，所以第一行为-1。
    const row = parseInt(key.match(/([\d]+)/)[1])-2;
    const value = worksheet[key].v.toString().replace(/(^\s*)|(\s*$)/g, '');
    

    if(row === -1 ){
      //检测表头是否错误
      if(!headerArr.includes(value)) errMessage.push("("+value+")");
      headers[col]=value;
      return;
    }

    if(!data[row]){
      data[row]={}
    }

    data[row][headers[col]] = value;
    
    });

  //检测表头字段是否正确
  if(errMessage.length !== 0){
    res.send(JSON.stringify('the header of table is err, '+errMessage));
    console.log(errMessage);
    return;
  }

  data.forEach(tacInfo=>{
    (async ()=>{
      const check = await tacModel.find({'TAC':tacInfo['TAC']});
      if(!check) await tacModel.create(tacInfo);
      if(!!check) await console.log('data exist',tacInfo);
    })()
  });

  res.send(JSON.stringify('success'));
};




const spider = async (keyWord)=>{

  const res = await superAgent.get(search+urlEncode(keyWord,'gbk')).set('User-Agent',userAgent).set('Cookie',cookie).charset();
  const $1 = await cheerio.load(res.text);
  //搜索结果第一条信息
  const device = $1('div#wrapper div.main div.list-item').eq(0).find('h3').find('a').attr('href');

  if(!device) {throw 'no match result'}
  const deviceUrl = 'http://detail.zol.com.cn'+ device;
  const devicePage = await superAgent.get(deviceUrl).set('User-Agent',userAgent).set('Cookie',cookie).charset();
  const $2 = await cheerio.load(devicePage.text);
  //详情页面
  const detailUrl = 'http://detail.zol.com.cn' + $2('div.section a._j_MP_more').attr('href');
  console.log(detailUrl);

  const detailPage = await superAgent.get(detailUrl).withCredentials().set('User-Agent',userAgent).set('Cookie',cookie).charset();

  const $3 = await cheerio.load(detailPage.text);

  return await $3('div#newTb table li span').map((index, element)=>{
    if($3(element).text() !== ''){return $3(element).text()}
  }).toArray();
  
};

exports.getList = (req, res)=>{
  spider(req.body.query)
    .then(result=>res.send(JSON.stringify(result)))
    .catch(err=>res.send(JSON.stringify(err)))
};
