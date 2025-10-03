// routes/groupChatRoutes.js
const express = require('express');
const router = express.Router();
const { sendGroupMessage, getGroupMessages } = require('../controllers/groupChatController');
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/sendGroupMessage', isAuthenticated, sendGroupMessage);
router.get('/getGroupMessages', isAuthenticated, getGroupMessages);

module.exports = router;
