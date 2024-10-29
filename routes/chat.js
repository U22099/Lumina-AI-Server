const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController')

router.get('/', chatController.getChats);
router.delete('/', chatController.clearChats);
router.post('/text', chatController.TextPrompt);
router.post('/voice', chatController.VoicePrompt);
router.post('/file', chatController.FilePrompt);
router.post('/gen-image', chatController.GenerateImage);

module.exports = router;
