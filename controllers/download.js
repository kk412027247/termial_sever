const fs =require('fs');
const iconv = require('iconv-lite');
const getListModel = require('../models/getList');
const tacModel = require('../models/tac');


exports.download = (req, res) =>{
  if(!req.query._id){
    res.download('./public/template/查无结果');
  }else{
    if((typeof req.query._id)==='string'){
      this.arr = [req.query._id]
    }else{
      this.arr = req.query._id;
    }

    const query = this.arr.map(item=>({_id:item}));
    const fileName1 = Date.now();
    const file1 = `./public/${fileName1}.csv`;

    getListModel
      .find({$or:query})
      .sort({"厂商(中文)":1,"品牌(英文)":1,"型号":1})
      .cursor()
      .pipe(getListModel.csvTransformStream())
      .pipe(fs.createWriteStream(file1));

    fs.watchFile(file1,()=>{
      fs.unwatchFile(file1);
      //回调地狱版233，因为只用一次,所以就不该成async/await了
      fs.readFile(file1,(err,buffer)=>{
        if(!err){
          fs.writeFile(file1,iconv.encode(buffer,'GB18030'),(err)=>{
            if(!err)res.download(file1,()=>{
              fs.unlink(file1,()=>{})
            });
          })
        }
      });
    });
    }
};

exports.downloadTac = (req, res) =>{
  if(!req.query._id){
    res.download('./public/template/查无结果');
  }else{
    if((typeof req.query._id)==='string'){
      this.arr = [req.query._id]
    }else{
      this.arr = req.query._id;
    }

    const query = this.arr.map(item=>({_id:item}));
    const fileName2 = Date.now();
    const file2 = `./public/tac${fileName2}.csv`;

    tacModel
      .find({$or:query})
      .sort({'品牌1':1,'型号1':1})
      .cursor()
      .pipe(tacModel.csvTransformStream())
      .pipe(fs.createWriteStream(file2));

    fs.watchFile(file2,()=>{
      fs.unwatchFile(file2);
      //又是回调地狱版，不想写一堆promise了，就酱紫吧！
      fs.readFile(file2,(err,buffer)=>{
        if(!err){
          fs.writeFile(file2,iconv.encode(buffer,'GB18030'),(err)=>{
            if(!err)res.download(file2,()=>{
              fs.unlink(file2,()=>{})
            });
          })
        }
      });
    });
  }
};


const createFile = (file, res) =>{
  fs.watchFile(file,()=>{
    fs.unwatchFile(file);
    //又是回调地狱版，不想写一堆promise了，就酱紫吧！
    fs.readFile(file,(err,buffer)=>{
      if(!err){
        fs.writeFile(file,iconv.encode(buffer,'GB18030'),(err)=>{
          if(!err)res.download(file,()=>{
            fs.unlink(file,()=>{})
          });
        });
      }
    });
  });
};

exports.downloadTacByDate = (req, res)=>{
  const fileName = Date.now();
  const file = `./public/tac&date${fileName}.csv`;
  const {startDate, endDate} = req.query;
  tacModel
    .count({date: {$gte: new Date(startDate), $lt: new Date(endDate)}})
    .then(number=>{
      if(number === 0){
        res.download('./public/template/查无结果');
      }else{
        tacModel
          .find({date: {$gte: new Date(startDate), $lt: new Date(endDate)}})
          .sort({date: 1})
          .cursor()
          .pipe(tacModel.csvTransformStream())
          .pipe(fs.createWriteStream(file));
        createFile(file,res)
      }
    });
};


exports.downloadInfoByDate = (req, res)=>{
  const fileName = Date.now();
  const file = `./public/info&date${fileName}.csv`;
  const {startDate, endDate} =  req.query ;
  //getListModel.findOne({});

  getListModel
    .count({date: {$gte: new Date(startDate), $lt: new Date(endDate)}})
    .then(number=>{
      if(number === 0){
        res.download('./public/template/查无结果');
      }else{
        getListModel
          .find({date: {$gte: new Date(startDate), $lt: new Date(endDate)}})
          .sort()
          .cursor()
          .pipe(getListModel.csvTransformStream())
          .pipe(fs.createWriteStream(file));
        createFile(file,res)
      }
    });
};


exports.downloadTemplate = (req,res)=>{
  res.download('./public/template/template.xlsx')
};
