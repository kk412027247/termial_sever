const express = require('express');
const router = express.Router();

const getListController = require('../controllers/getList');

router.get('/getList', getListController.getList);

module.exports = router;
