const express = require('express');
const {
  getDashboard,
  getTeacherClasses,
  getClassStudents,
  getAttendanceReport,
  getStudentDetails
} = require('../controllers/teacherController.js');
const { protect, authorize } = require('../middleware/auth.js');

const router = express.Router();

// All routes require teacher authentication
router.use(protect);

router.get('/dashboard', authorize(['teacher']), getDashboard);
router.get('/classes', authorize(['teacher']), getTeacherClasses);
router.get('/classes/:classId/students', authorize(['teacher']), getClassStudents);
router.get('/reports/attendance', authorize(['teacher']), getAttendanceReport);
router.get('/students/:studentId', authorize(['teacher']), getStudentDetails);

module.exports = router;