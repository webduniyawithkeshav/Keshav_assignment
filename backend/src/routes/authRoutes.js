const express = require('express');
const router = express.Router();
const { register, login, verifyTokenController } = require('../controllers/authController');
const { authValidation } = require('../middleware/validator');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin
 * @access  Public
 */
router.post('/register', authValidation.register, register);

/**
 * @route   POST /api/auth/login
 * @desc    Login admin
 * @access  Public
 */
router.post('/login', authValidation.login, login);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token
 * @access  Protected
 */
router.get('/verify', auth, verifyTokenController);

module.exports = router;
