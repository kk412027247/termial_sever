const express = require('express');
const router = express.Router();
const getListController = require('../controllers/getList');
const authController = require('../controllers/auth');
const downloadController = require('../controllers/download');
const tacController = require('../controllers/tac');
const updateController = require('../controllers/update');
const uploadController = require('../controllers/upload');
const spiderController = require('../controllers/spider');
const check = require('../check/check');

//这个中间件，大概是用来做上传文件储存的
const multer = require('multer');
//确定粗存目录以及文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });




//爬虫
router.post('/spider', spiderController.spider);
router.post('/add', getListController.add);

//查询
router.post('/query',check.query ,getListController.query);
router.post('/getInfoTac', check.basie, getListController.getInfoTac);
router.post('/getTacForInfo', check.basie, getListController.getTacForInfo);
router.post('/getTacId',check.update,tacController.getTacId);

//上传文件
router.post('/uploadTac',check.basie,upload.single('file'),uploadController.uploadTac);
router.post('/createTacWithImage',upload.single('image'), tacController.createTacWithImage);

//新增TAC数据
router.post('/createTac',check.create, tacController.createTac);



//修改
router.post('/updates', check.update, getListController.updates);
router.post('/updateTac', check.basie, tacController.updateTac);

//保存数据
router.post('/saveUploadTac', check.basie, tacController.saveUploadTac);


//登陆
router.post('/signIn', authController.signIn);
router.get('/signOut', authController.signOut);
router.get('/getSession', authController.getSession);
router.post('/changePassword',check.basie,authController.changePassword);

//用户管理
router.post('/addUser', check.handleUser, authController.addUser);
router.get('/getUserList', check.handleUser, authController.getUserList);
router.get('/getAllUserList', check.handleUser, authController.getAllUserList);
router.post('/removeUser', check.handleUser, authController.removeUser);
router.post('/updateUser', check.handleUser, authController.updateUser);


//下载
router.get('/download', check.download, downloadController.download);
router.get('/downloadTac', check.download, downloadController.downloadTac);
router.get('/downloadTemplate',downloadController.downloadTemplate);


//查询修改记录
router.get('/getUpdateHistory',check.updateHistory,updateController.getUpdateHistory);


module.exports = router;
