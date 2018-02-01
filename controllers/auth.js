const authModel = require('../models/auth');
const tacModel = require('../models/tac');

exports.signIn = (req, res)=>{
  authModel.signIn(req.body,(err, doc)=>{
    if(err){
      //console.log('数据库出错');
      res.send(JSON.stringify('数据库出错'))
    }else if(doc === null){
      //console.log('密码／用户名错误');
      res.send(JSON.stringify(0))
    }else{
      //登陆成功之后，在session对象定义一个level的数值
      req.session.userInfo = {userName:doc.userName, level:doc.level};
      res.send(JSON.stringify({userName:doc.userName, level:doc.level}));
      //console.log(req.session.userInfo)
      //console.log('登陆成功');
    }
  })
};

exports.signOut = (req, res)=>{
  req.session.destroy();
  //console.log(req.session);
  res.send(JSON.stringify('signOut'))
};

exports.getSession = (req, res)=>{
  if(req.session.userInfo) {
    //console.log('getSession success');
    res.send(JSON.stringify(req.session.userInfo))
  }else{
    //console.log('getSession failure');
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
  //console.log(req.body);
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

exports.searchUserHistory = (req, res) =>{
  authModel.searchUserHistory(req)
    .then(success=>res.send(JSON.stringify(success)))
    .catch(err=>res.send(JSON.stringify(err)));
};

exports.getUserHistory = (req, res) =>{
  authModel.getUserHistory(req)
    .then(result=>res.send(JSON.stringify(result)))
    .catch(err=>res.send(JSON.stringify(err)))
};

exports.getUserHistoryByPC =  async (req, res) => {
  const history = (await authModel.getUserHistoryByPC(req)).history;

  // promise 的并发虽然虽然比较快，但是嵌套循环太多，影响效率，并且写法太繁琐，放弃。
  // if(Array.isArray(history)){
  //   //promise 并发设置，写起来没有次序发送的简洁，但是这样运行比较快
  //   const originId = history.reduce((pre,cur)=>{
  //     if(cur.status === 'cache'){
  //       return [...pre, tacModel.findOne({_id:cur._id})]
  //     }else{
  //       return pre
  //     }
  //   },[]);
  //   const originDoc = await Promise.all(originId) ;
  //
  // }

  const netHistory = [];
  if(Array.isArray(history)){
    for(let _history of history){
      if(_history.status === 'cache'){
        netHistory.push({
          cache:_history,
          origin:await tacModel.findOne({_id:_history._id})
        });
      }else{
        netHistory.push(_history)
      }
    }
  }
  res.send(JSON.stringify(netHistory))
};

exports.updateHistoryByPC = async (req, res)=>{
  const doc =await authModel.updateHistoryByPC(req);
  console.log(doc);
  res.send(JSON.stringify('updateSuccess'))
};
