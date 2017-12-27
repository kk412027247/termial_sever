const XLSX = require('xlsx');
const fs = require('fs');
const tacModel = require('../models/tac');
const headerArr = ['TAC','品牌1','型号1','可信度1','新可信度1','品牌2','型号2','可信度2','新可信度2','品牌3','型号3','可信度3','新可信度3','品牌4','型号4','可信度4','新可信度4','品牌5','型号5','可信度5','新可信度5','品牌6','型号6','可信度6','新可信度6','品牌7','型号7','可信度7','新可信度7'];

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
    //第一行为-1
    if(row === -1 ){
      //检测表头是否错误,如果存在就存起来
      if(!headerArr.includes(value)) errMessage.push("("+value+")");
      headers[col]=value;
      return;
    }
    if(!data[row]){
      data[row]={}
    }

    data[row][headers[col]] = value.replace(/(-*)|(_*)|(,*)|(，*)/,' ').replace(/(^\s*)|(\s*$)/g, '');
    
    });

  //检测表头字段是否正确
  if(errMessage.length !== 0){
    res.send(JSON.stringify('the header of table is err, '+errMessage));
    console.log(errMessage);
    return;
  }

  //异步转同步操作
  (async()=>{
    const _data = {dataExist:[],uploadExist:[],valid:[]};
    for(let tacInfo of data){
      const check = await tacModel.find({'TAC':tacInfo['TAC']});
      if(!!check){
        _data.dataExist=[..._data.dataExist, ...check];
        _data.uploadExist=[..._data.uploadExist, tacInfo]
      }else{
        _data.valid = [..._data.valid, tacInfo]
      }
    }
    await res.send(JSON.stringify(_data))
  })();

};

