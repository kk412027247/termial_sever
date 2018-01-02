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
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

//爬虫
router.post('/spider', spiderController.spider);
router.post('/add', getListController.add);

//查询
router.post('/query',check.basie, getListController.query);
router.post('/getInfoTac', check.basie, getListController.getInfoTac);
router.post('/getTacForInfo', check.basie, getListController.getTacForInfo);
router.post('/getTacId',check.update,tacController.getTacId);

//上传文件
router.post('/uploadTac',upload.single('file'),uploadController.uploadTac);

//新增TAC数据
router.post('/createTac',tacController.createTac);

//修改
router.post('/updates', check.update, getListController.updates);
router.post('/updateTac', tacController.updateTac);

//保存数据
router.post('/saveUploadTac',tacController.saveUploadTac);


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


//查询修改记录
router.post('/getUpdateHistory',check.updateHistory,updateController.getUpdateHistory);


module.exports = router;
