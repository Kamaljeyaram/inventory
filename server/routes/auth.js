/**
 * Authentication routes
 * Handles user login, registration, and authentication
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Mock login for development (in a real app, would verify credentials)
    logger.info(`Login attempt for user: ${email}`);
    
    // Return success with token
    res.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: 'John Doe',
        email: email,
        role: 'admin'
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Mock registration (in a real app, would save to database)
    logger.info(`New user registration: ${email}`);
    
    res.json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: 1,
        name,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

/**
 * @route   GET /api/v1/auth/user
 * @desc    Get user data
 * @access  Private
 */
router.get('/user', (req, res) => {
  try {
    // Mock get user info (in a real app, would fetch from database)
    logger.info(`User info request`);
    
    res.json({
      success: true,
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'admin',
        department: 'Operations',
        phone: '+91 9876543210',
        address: 'Whitefield, Bangalore, Karnataka, India - 560066',
        joinDate: '2022-05-15'
      }
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting user data' 
    });
  }
});

module.exports = router;