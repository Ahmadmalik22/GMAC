const User = require('../models/User.js');
const Student = require('../models/Student.js');
const Attendance = require('../models/Attendance.js');

// @desc    Get teacher dashboard
// @route   GET /api/teacher/dashboard
// @access  Private (Teacher)
const getDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Without Class model, we infer "Classes" from Students assigned to this teacher? 
    // Actually, in this system, the Student model has 'group' and 'classLevel', but no direct 'teacher' field.
    // However, if we assume any teacher can see stats for now, or if we had a way to link them.
    // The previous Class model linked Teacher -> Class -> Students.
    // Now we likely just show global stats or stats based on attendance marked by this teacher.
    
    // Get recent attendance records marked by this teacher (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentAttendance = await Attendance.find({
      teacherId: teacherId, // Updated from 'teacher' to 'teacherId' based on Attendance controller usage
      date: { $gte: sevenDaysAgo }
    })
    // .populate('student', 'firstName lastName rollNumber') // Attendance schema stores records array now...
    // The Attendance model structure in controller was: 
    // { date, period, classLevel, group, subject, teacherId, records: [{studentId, status}] }
    // So 'find' returns documents, not single student records.
    .sort({ date: -1, createdAt: -1 })
    .limit(5);

    // We need to transform these documents into a "feed" of activities
    // e.g. "Marked attendance for 11th ICS Physics"
    const recentActivity = recentAttendance.map(doc => ({
      id: doc._id,
      type: 'attendance_marked',
      description: `Marked attendance for ${doc.classLevel} ${doc.group} (${doc.subject})`,
      date: doc.date,
      timestamp: doc.createdAt
    }));

    // Calculate generic stats based on this teacher's activity
    
    // Total attendance sessions marked
    const totalSessions = await Attendance.countDocuments({ teacherId });

    // Today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = await Attendance.countDocuments({
      teacherId: teacherId,
      date: { $gte: today, $lt: tomorrow }
    });

    res.status(200).json({
      success: true,
      data: {
        // Return mostly empty/generic structure to keep frontend happy if it expects specific keys
        classes: [], // No classes schema
        recentAttendance: recentActivity,
        statistics: {
          totalClasses: 0, 
          totalStudents: 0, // Can't easily know "my" students without Class assignment
          attendanceThisMonth: { // Placeholder
            total: totalSessions,
            present: 0,
            absent: 0,
            leave: 0,
            percentage: 0
          },
          todayAttendance: todaySessions
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get teacher's classes
// @route   GET /api/teacher/classes
// @access  Private (Teacher)
const getTeacherClasses = async (req, res) => {
  // Stub: Return empty list or distinct classLevels/groups from Students
  // Since we deleted Class model, we can't really return "My Classes".
  // Maybe return all available groups as "classes"?
  res.status(200).json({
    success: true,
    data: []
  });
};

// @desc    Get students in a specific class
// @route   GET /api/teacher/classes/:classId/students
// @access  Private (Teacher)
const getClassStudents = async (req, res) => {
   // Deprecated
   res.status(404).json({ success: false, error: 'Feature unavailable without Class schema' });
};

// @desc    Get attendance report
// @route   GET /api/teacher/reports/attendance
// @access  Private (Teacher)
const getAttendanceReport = async (req, res) => {
  // Simplify to just use Attendance model aggregation if needed, or stub
  res.status(200).json({ success: true, data: { report: [], summary: {} } });
};

// @desc    Get student details
// @route   GET /api/teacher/students/:studentId
// @access  Private (Teacher)
const getStudentDetails = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        if(!student) return res.status(404).json({success: false, error: "Student not found"});
        
        // Return without class info
         res.status(200).json({
            success: true,
            data: {
                student: {
                    id: student._id,
                    rollNumber: student.rollNo, // Student schema uses rollNo
                    name: student.name,
                    fname: student.fname,
                    group: student.group,
                    subjects: student.subjects
                },
                class: { name: `${student.classLevel} ${student.group}` },
                recentAttendance: [], // complex to aggregate from new structure efficiently without specific query
                attendanceStats: { total: 0, present: 0, percentage: 0 }
            }
        });
    } catch(err) {
        res.status(500).json({success: false, error: err.message});
    }
};

module.exports = {
  getDashboard,
  getTeacherClasses,
  getClassStudents,
  getAttendanceReport,
  getStudentDetails
};