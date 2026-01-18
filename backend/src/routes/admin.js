const express = require('express');
const {
  getDashboardStats,
  getTeachers,
  registerTeacher,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getSystemInfo,
  getStudentStats
} = require('../controllers/adminController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// All routes require admin authentication
router.use(protect);

router.get('/dashboard/stats', getDashboardStats);
router.get('/system/info', authorize(['admin']), getSystemInfo);
router.get('/student-stats', authorize(['admin']), getStudentStats);

// Teacher management routes
router.get('/teachers', authorize(['admin']), getTeachers);
router.post('/register-teacher', authorize(['admin']), registerTeacher);
router.get('/teachers/:id', authorize(['admin']), getTeacher);
router.put('/teachers/:id', authorize(['admin']), updateTeacher);
router.delete('/teachers/:id', authorize(['admin']), deleteTeacher);

module.exports = router;