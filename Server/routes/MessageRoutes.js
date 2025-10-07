const express = require('express');
const router = express.Router();
const { sendMessage, getMessages , getMessagesWithLeader } = require('../controllers/MessagesController');
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/send', isAuthenticated, sendMessage);
router.get('/:userId/:memberId', isAuthenticated, getMessages);
router.get('/leader', isAuthenticated, getMessagesWithLeader);


module.exports = router;