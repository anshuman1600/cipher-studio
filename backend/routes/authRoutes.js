// ========================================
// AUTH ROUTES
// Routes for user authentication
// ========================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import auth middleware (we'll create this next)
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private (requires token)
 */
router.get('/me', protect, authController.getMe);

module.exports = router;
