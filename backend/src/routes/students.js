const express = require('express');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.get('/', authorize(['admin', 'teacher']), getStudents);
router.post('/', authorize(['admin']), createStudent);

// Routes accessible by admin and teachers
router.get('/:id', authorize(['admin', 'teacher']), getStudent);

// Admin only routes for modifications
router.put('/:id', authorize(['admin']), updateStudent);
router.delete('/:id', authorize(['admin']), deleteStudent);

module.exports = router;