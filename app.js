const express = require('express');
const app = express();
const host = require('./host');

const path = require('path');
//const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

//session模块设置
const session=require('express-session');
const RedisStore=require('connect-redis')(session);
app.use(session({
  secret:'cc',
  store:new RedisStore({
    port:6379,
    host:'127.0.0.1',
  }),
  //session会影响安全，设置有效期为一天
  cookie:{ maxAge: 24*60*60*1000 },
  resave:true,
  saveUninitialized:true
}));






//const index = require('./routes/index');
const users = require('./routes/users');
const webRouter = require ('./routes/webRouter');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 跨域请求设置
app.all('*', function(req, res, next) {
  // 只允许127.0.0.1跨域访问
  res.header("Access-Control-Allow-Origin", host.acao);
  //res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


app.use('/', webRouter);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log('http://localhost:3001/');

module.exports = app;
