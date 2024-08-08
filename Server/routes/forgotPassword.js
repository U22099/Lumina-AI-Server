const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controller/forgotPasswordController')

router.post('/', forgotPasswordController.sendEmail);

module.exports = router;