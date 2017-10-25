const express = require('express');
const router = express.Router();

const getListController = require('../controllers/getList');

router.get('/getList', getListController.getList);

router.get('/getPrice', getListController.getPrice);

router.post('/query', getListController.query);

module.exports = router;
