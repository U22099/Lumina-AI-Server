const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController')

router.get('/', chatController.getChats);
router.post('/text', chatController.TextPrompt);
router.get('/image', chatController.ImagePrompt);

module.exports = router;