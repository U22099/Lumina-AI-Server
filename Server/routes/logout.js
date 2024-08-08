const express = require('express');
const router = express.Router();
const logoutController = require('../controller/logoutController');

router.post('/', logoutController.logOut);

module.exports = router;
