const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add more routes for create, update, delete operations