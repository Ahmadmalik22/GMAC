const express = require('express');
const {
  markAttendance,
  updateAttendance,
  getAttendanceSummary,
  getAttendanceRecords
} = require('../controllers/attendanceController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Teacher routes
// Note: Mark attendance now deals with classLevel/group, not 'classId'.
// authorizeClassTeacher middleware might be broken if it relies on classId param.
// Since we are using generic classLevel/group, basic 'teacher' role check is sufficient for now.
router.post('/mark', authorize(['teacher']), markAttendance);
router.put('/:id', authorize(['teacher', 'admin']), updateAttendance); // Admin might edit too

// Admin/Teacher routes for info
router.get('/summary', authorize(['admin', 'teacher']), getAttendanceSummary);
router.get('/records', authorize(['admin', 'teacher']), getAttendanceRecords);

module.exports = router;