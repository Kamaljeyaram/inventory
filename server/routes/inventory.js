const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const logger = require('../utils/logger');

// Simulated in-memory data (replace with DB calls later)
let inventoryItems = [
  { id: 1, sku: 'SKU001', name: 'Laptop', category: 'Electronics', quantity: 25, location: 'Warehouse A', status: 'In Stock' },
  { id: 2, sku: 'SKU002', name: 'Office Chair', category: 'Furniture', quantity: 15, location: 'Warehouse B', status: 'In Stock' },
  // ... (other sample items)
];

let transactions = [];

// Status determination logic
const getItemStatus = (quantity) => {
  if (quantity <= 0) return 'Out of Stock';
  if (quantity <= 5) return 'Low Stock';
  return 'In Stock';
};

// Utility: Handle validation errors
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
};

// ──────────────── ROUTES ──────────────── //

/**
 * @route   GET /api/v1/inventory
 */
router.get('/', (req, res) => {
  try {
    res.json({ success: true, count: inventoryItems.length, data: inventoryItems });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route   GET /api/v1/inventory/:id
 */
router.get('/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
  if (handleValidation(req, res)) return;

  const id = parseInt(req.params.id);
  const item = inventoryItems.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  res.json({ success: true, data: item });
});

/**
 * @route   POST /api/v1/inventory
 */
router.post('/', [
  body('sku').notEmpty().withMessage('SKU is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative number')
], (req, res) => {
  if (handleValidation(req, res)) return;

  const { sku, name, category, quantity = 0, location = '' } = req.body;

  if (inventoryItems.some(item => item.sku === sku)) {
    return res.status(400).json({ success: false, message: 'SKU already exists' });
  }

  const newItem = {
    id: inventoryItems.length ? Math.max(...inventoryItems.map(i => i.id)) + 1 : 1,
    sku,
    name,
    category,
    quantity,
    location,
    status: getItemStatus(quantity)
  };

  inventoryItems.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

/**
 * @route   PUT /api/v1/inventory/:id
 */
router.put('/:id', [
  param('id').isInt().withMessage('ID must be an integer'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer')
], (req, res) => {
  if (handleValidation(req, res)) return;

  const id = parseInt(req.params.id);
  const index = inventoryItems.findIndex(item => item.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const item = inventoryItems[index];
  const { sku, name, category, quantity, location } = req.body;

  const updatedItem = {
    ...item,
    sku: sku || item.sku,
    name: name || item.name,
    category: category || item.category,
    quantity: quantity !== undefined ? quantity : item.quantity,
    location: location || item.location,
    status: getItemStatus(quantity !== undefined ? quantity : item.quantity)
  };

  inventoryItems[index] = updatedItem;
  res.json({ success: true, data: updatedItem });
});

/**
 * @route   DELETE /api/v1/inventory/:id
 */
router.delete('/:id', [
  param('id').isInt().withMessage('ID must be an integer')
], (req, res) => {
  if (handleValidation(req, res)) return;

  const id = parseInt(req.params.id);
  const index = inventoryItems.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const removed = inventoryItems.splice(index, 1)[0];
  res.json({ success: true, message: 'Deleted successfully', data: removed });
});

/**
 * @route   POST /api/v1/inventory/:id/transaction
 */
router.post('/:id/transaction', [
  param('id').isInt().withMessage('ID must be an integer'),
  body('type').isIn(['lend', 'give', 'receive', 'add']).withMessage('Invalid transaction type'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('recipient').notEmpty().withMessage('Recipient is required')
], (req, res) => {
  if (handleValidation(req, res)) return;

  const id = parseInt(req.params.id);
  const index = inventoryItems.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }

  const { type, quantity, recipient, purpose = '', returnDate = null } = req.body;
  const item = inventoryItems[index];

  if (['lend', 'give'].includes(type) && item.quantity < quantity) {
    return res.status(400).json({ success: false, message: 'Not enough quantity available' });
  }

  const updatedQuantity =
    type === 'lend' || type === 'give' ? item.quantity - quantity : item.quantity + quantity;

  inventoryItems[index] = {
    ...item,
    quantity: updatedQuantity,
    status: getItemStatus(updatedQuantity)
  };

  const transaction = {
    id: transactions.length ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
    itemId: id,
    type,
    quantity,
    recipient,
    purpose,
    returnDate: type === 'lend' ? returnDate : null,
    returned: false,
    userId: 1,
    date: new Date().toISOString()
  };

  transactions.push(transaction);

  res.json({ success: true, data: { item: inventoryItems[index], transaction } });
});

module.exports = router;
