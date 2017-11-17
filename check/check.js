//登陆验证中间件
exports.check3 = (req,res,next)=>{
  if(req.session.userInfo.level === 3){
    console.log(req.session.userInfo.level);
    next()
  }else{
    console.error('权限出错');
    res.send(JSON.stringify('failure'))
  }
};

exports.checkQuery = (req,res,next)=>{
  if(req.session.userInfo.level >= 1 &&  req.session.userInfo.level <= 3){
    next()
  }else{
    console.error('查询权限出错');
    res.send(JSON.stringify([]))
  }
};

//module.exports = check;
