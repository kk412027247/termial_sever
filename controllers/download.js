const fs =require('fs');
const iconv = require('iconv-lite');


const getListModel = require('../models/getList');
const updateModel = require('../models/update');


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
    const fileName = Date.now();
    const file = `./public/${fileName}.csv`;

    getListModel
      .find({$or:query})//.find({$or:req.body})
      .cursor()
      .pipe(getListModel.csvTransformStream())
      .pipe(fs.createWriteStream(file));

    fs.watchFile(file,()=>{
      fs.unwatchFile(file);
      const buffer = fs.readFileSync(file);
      //这里生成了GBK格式的文件给excel打开；
      fs.writeFileSync(file,iconv.encode(buffer,'GB18030'));
      res.download(file,()=>{
        fs.unlinkSync(file)
      });

    });

    console.log(`${file}文件生成中`);
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
    const fileName = Date.now();
    const file = `./public/tac${fileName}.csv`;

    updateModel
      .find({$or:query})//.find({$or:req.body})
      .cursor()
      .pipe(updateModel.csvTransformStream())
      .pipe(fs.createWriteStream(file));

    fs.watchFile(file,()=>{
      fs.unwatchFile(file);
      const buffer = fs.readFileSync(file);
      //这里生成了GBK格式的文件给excel打开；
      fs.writeFileSync(file,iconv.encode(buffer,'GB18030'));
      res.download(file,()=>{
        fs.unlinkSync(file)
      });
    });

    console.log(`${file}文件生成中`);
  }
};
