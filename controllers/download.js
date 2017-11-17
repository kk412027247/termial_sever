const fs =require('fs');
//const iconv = require('iconv-lite');


const getListModel = require('../models/getList');


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
      res.download(file,()=>{
        fs.unlinkSync(file)
      });
      fs.unwatchFile(file);
    });

    console.log(`${file}文件生成中`);
  }
};
