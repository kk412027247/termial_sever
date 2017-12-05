const authModel = require('../models/auth');


exports.signIn = (req, res)=>{
  console.log(req.body);
  authModel.signIn(req.body,(err, doc)=>{
    if(err){
      console.log('数据库出错');
      res.send(JSON.stringify('数据库出错'))
    }else if(doc === null){
      console.log('密码／用户名错误');
      res.send(JSON.stringify(0))
    }else{
      //登陆成功之后，在session对象定义一个level的数值
      console.log('登陆成功');
      req.session.userInfo = {userName:doc.userName, level:doc.level};
      res.send(JSON.stringify({userName:doc.userName, level:doc.level}))
    }
  })
};

exports.signOut = (req, res)=>{
  req.session.destroy();
  console.log(req.session);
  res.send(JSON.stringify('signOut'))
};

exports.getSession = (req, res)=>{
  if(req.session.userInfo) {
    console.log('getSession success');
    res.send(JSON.stringify(req.session.userInfo))
  }else{
    console.log('getSession failure');
    res.send(JSON.stringify({}))
  }
};

exports.changePassword = (req, res) =>{
  //console.log('修改密码请求体',req.body);
  authModel.changePassword(req.body,(err,doc)=>{
    //console.log('密码修改结果',doc);
    res.send(JSON.stringify(doc))
  })
};

exports.addUser = (req, res)=>{
  console.log(req.body);
  authModel.findOne({userName:req.body.userName},(err,doc)=>{
    if(!err && doc ===null){
      authModel.register(req.body,(_err,_doc)=>{
        if(_err){
          res.send(JSON.stringify('failure'))
        }else{
          res.send(JSON.stringify(_doc))
        }
      })
    }else{
      res.send(JSON.stringify('failure'))
    }
  });
};

exports.getUserList = (req, res)=>{
  authModel.find({level:{$lt:4}})
    .then(result=>res.send(JSON.stringify(result)))
    .catch(err=>res.send(JSON.stringify(err)));
};

exports.getAllUserList = (req, res)=>{
  authModel.find({},{userName:1,_id:0})
    .then(result=>res.send(JSON.stringify(result)))
    .catch(err=>res.send(JSON.stringify(err)));
};


exports.removeUser = (req, res)=>{
  authModel.findByIdAndRemove(req.body._id)
    .then(result=>res.send(JSON.stringify(result)))
    .catch(err=>res.send(JSON.stringify(err)));
};

exports.updateUser = (req, res) => {
  //console.log(req.body);
  const{_id,...doc} = req.body;
  authModel.findByIdAndUpdate(_id,doc)
    .then(result=>res.send(JSON.stringify(result)))
    .catch(err=>res.send(JSON.stringify(err)));
};
