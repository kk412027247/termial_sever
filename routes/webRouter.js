const express = require('express');
const router = express.Router();
const getListController = require('../controllers/getList');
const authController = require('../controllers/auth');
const check = require('../check/check');


router.get('/getList', getListController.getList);
router.get('/getPrice', getListController.getPrice);
router.post('/query', getListController.query);
router.post('/updates', getListController.updates);
router.post('/add', getListController.add);
router.post('/signIn', authController.signIn);
router.post('/register', check.check3, authController.register);
router.get('/signOut', authController.signOut);




router.get('/test',check.check3,(req,res)=>{
  res.send(JSON.stringify(req.session.level))
});

module.exports = router;
