const fs =require('fs');
const iconv = require('iconv-lite');
const getListModel = require('../models/getList');
const tacModel = require('../models/tac');

//一次只能下载一个文件？？？
exports.download = (req, res) =>{
  if(!req.query._id){
    res.download('1');
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
      const buffer = fs.readFileSync(file1);
      //这里生成了GBK格式的文件给excel打开；
      fs.writeFileSync(file1,iconv.encode(buffer,'GB18030'));
      res.download(file1,()=>{
        fs.unlinkSync(file1)
      });

    });

    console.log(`${file1}文件生成中`);
  }
};

exports.downloadTac = (req, res) =>{
  if(!req.query._id){
    res.download('1');
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
      const buffer = fs.readFileSync(file2);
      //这里生成了GBK格式的文件给excel打开；
      fs.writeFileSync(file2,iconv.encode(buffer,'GB18030'));
      res.download(file2,()=>{
        fs.unlinkSync(file2)
      });
    });

    console.log(`${file2}文件生成中`);
  }
};
