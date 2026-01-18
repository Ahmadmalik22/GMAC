const express = require('express');
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass
} = require('../controllers/classController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Class management routes
router.get('/', authorize(['admin', 'teacher']), getClasses);
router.get('/:id', authorize(['admin', 'teacher']), getClass);

// Admin only routes for class management
router.post('/', authorize(['admin']), createClass);
router.put('/:id', authorize(['admin']), updateClass);
router.delete('/:id', authorize(['admin']), deleteClass);

module.exports = router;