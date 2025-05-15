const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googlelogin, googleRegisterUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googlelogin )
router.post('/google-register', googleRegisterUser);
module.exports = router;
