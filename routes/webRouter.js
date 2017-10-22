const express = require('express');
const router = express.Router();

const getListController = require('../controllers/getList');

router.get('/query', getListController.getList);

router.post('/query', getListController.query);

module.exports = router;
