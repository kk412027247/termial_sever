const express = require('express');
const router = express.Router();
const getListController = require('../controllers/getList');
const authController = require('../controllers/auth');
const downloadController = require('../controllers/download');
const tacController = require('../controllers/tac');
const updateController = require('../controllers/update');
const check = require('../check/check');

//爬虫
router.get('/getList', getListController.getList);
router.get('/getPrice', getListController.getPrice);
router.post('/add', getListController.add);

//搜索
router.post('/query',check.basie, getListController.query);
router.post('/getInfoTac', check.basie, getListController.getInfoTac);
router.post('/getTacForInfo', check.basie, getListController.getTacForInfo);
router.post('/updates', check.update, getListController.updates);
router.post('/getTacId',tacController.getTacId);

//登陆注册
router.post('/signIn', authController.signIn);
router.get('/signOut', authController.signOut);
router.get('/getSession', authController.getSession);
router.post('/changePassword',check.basie,authController.changePassword);

//用户管理
router.post('/addUser', check.handleUser, authController.addUser);
router.get('/getUserList', check.handleUser, authController.getUserList);
router.post('/removeUser', check.handleUser, authController.removeUser);
router.post('/updateUser', check.handleUser, authController.updateUser);


//下载
router.get('/download', check.download, downloadController.download);
router.get('/downloadTac', check.download, downloadController.downloadTac);


//修改记录
router.post('/getUpdateHistory',updateController.getUpdateHistory);




module.exports = router;
