//登陆验证中间件

exports.query = (req, res, next)=>{
  if(!!req.session.userInfo && req.session.userInfo.level === 4){
    console.log(req.session.userInfo);
    next()
  }else{
    res.send(JSON.stringify(['queryNeedSession']))
  }
};

exports.create = (req, res, next)=>{
  if(!!req.session.userInfo && req.session.userInfo.level === 4){
    console.log(req.session.userInfo);
    next()
  }else{
    res.send(JSON.stringify(['createNeedSession']))
  }
};

exports.handleUser = (req,res,next)=>{
  if(!!req.session.userInfo && req.session.userInfo.level === 4){
    console.log(req.session.userInfo.level);
    next()
  }else{
    console.log('用户管理权限出错');
    res.send(JSON.stringify('用户管理权限出错'))
  }
};

exports.updateHistory = (req,res,next)=>{
  if(!!req.session.userInfo && req.session.userInfo.level === 4){
    console.log(req.session.userInfo.level);
    next()
  }else{
    console.log('用户管理权限出错');
    res.send(JSON.stringify('用户管理权限出错'))
  }
};

exports.basie = (req,res,next)=>{
  if(!!req.session.userInfo && req.session.userInfo.level >= 1 &&  req.session.userInfo.level <= 4){
    next()
  }else{
    console.error('查询权限出错');
    res.send(JSON.stringify([]))
  }
};

exports.update = (req,res,next)=>{
  if(!!req.session.userInfo && req.session.userInfo.level >= 2 &&  req.session.userInfo.level <= 4){
    next()
  }else{
    console.error('修改权限出错');
    res.send(JSON.stringify({}))
  }
};

exports.download = (req,res,next)=>{
  if(!!req.session.userInfo && req.session.userInfo.level >= 3 &&  req.session.userInfo.level <= 4){
    next()
  }else{
    console.error('下载权限出错');
    res.send(JSON.stringify('下载权限出错'))
  }
};



