// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { addUserToTeam, removeUserFromTeam , getTeamMembers } = require('../controllers/AdminController');

// Middleware to check if user is admin (you must implement it)
const isAuthenticated = require('../middleware/authMiddleware');

router.post('/add', isAuthenticated, addUserToTeam);
router.post('/remove', isAuthenticated, removeUserFromTeam);
router.get('/team', isAuthenticated, getTeamMembers);

module.exports = router;