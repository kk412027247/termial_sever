const express = require('express');
const router = express.Router();
const getListController = require('../controllers/getList');
const authController = require('../controllers/auth');
const downloadController = require('../controllers/download');
const tacController = require('../controllers/tac');
const check = require('../check/check');


router.get('/getList', getListController.getList);
router.get('/getPrice', getListController.getPrice);
router.post('/query',check.query, getListController.query);
router.post('/getInfoTac', getListController.getInfoTac);

router.post('/updates', getListController.updates);
router.post('/add', getListController.add);

router.post('/signIn', authController.signIn);
router.post('/register', check.check3, authController.register);
router.get('/signOut', authController.signOut);
router.get('/getSession', authController.getSession);
router.post('/changePassword',authController.changePassword);

router.get('/download',downloadController.download);

router.post('/getTac',tacController.query);



// router.get('/download',(req,res)=>{
//   const file = './public/1.text';
//   res.download(file);
// });


router.get('/test',check.check3,(req,res)=>{
  res.send(JSON.stringify(req.session.level))
});

module.exports = router;
