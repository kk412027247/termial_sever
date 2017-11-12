const express = require('express');
const router = express.Router();
const getListController = require('../controllers/getList');

router.get('/getList', getListController.getList);
router.get('/getPrice', getListController.getPrice);
router.post('/query', getListController.query);
router.post('/updates', getListController.updates);
router.post('/add',getListController.add);

module.exports = router;
