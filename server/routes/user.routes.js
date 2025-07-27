const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware'); // Import middleware

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected route
// The 'protect' function runs before 'getUserProfile'
router.get('/profile', protect, userController.getUserProfile);

module.exports = router;