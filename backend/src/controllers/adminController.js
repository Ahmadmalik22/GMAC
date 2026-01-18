const mongoose = require('mongoose');
const Student = require('../models/Student.js');
const Class = require('../models/Class.js');
const Attendance = require('../models/Attendance.js');
const User = require('../models/User.js');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    // Get date range from query params (default to current month)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    // Get basic counts
    const [totalStudents, totalTeachers, totalAttendanceRecords] = await Promise.all([
      Student.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'teacher', isActive: true }),
      Attendance.countDocuments({
        date: { $gte: startDate, $lte: endDate }
      })
    ]);

    // Get classLevel student distribution
    const gradeDistribution = await Student.aggregate([
      { $group: { _id: '$classLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get group distribution
    const groupDistribution = await Student.aggregate([
      { $group: { _id: '$group', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Simplified overview info
    const stats = {
      overview: {
        totalStudents,
        totalTeachers,
        totalAttendanceRecords,
        averageAttendance: 0 // Simplified for now
      },
      distributions: {
        grade: gradeDistribution,
        academicGroup: groupDistribution
      },
      attendance: { total: 0, present: 0, absent: 0, leave: 0 },
      recentActivities: [],
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get student statistics
// @route   GET /api/admin/student-stats
// @access  Private (Admin)
const getStudentStats = async (req, res) => {
  try {
    const { startDate, endDate, classLevel, group } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both startDate and endDate'
      });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Build query objects
    let studentQuery = {};
    if (classLevel && classLevel !== 'all') studentQuery.classLevel = classLevel;
    if (group && group !== 'all') studentQuery.group = group;

    let attendanceQuery = { 
        date: { $gte: start, $lte: end } 
    };
    if (classLevel && classLevel !== 'all') attendanceQuery.classLevel = classLevel;
    if (group && group !== 'all') attendanceQuery.group = group;

    console.log('Student Query:', studentQuery);
    const students = await Student.find(studentQuery).sort({ rollNo: 1 });
    console.log(`Found ${students.length} students`);
    
    if (students.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    console.log('Attendance Query:', attendanceQuery);
    const attendanceDocs = await Attendance.find(attendanceQuery);
    console.log(`Found ${attendanceDocs.length} attendance docs`);

    const statsMap = {};
    
    students.forEach(s => {
      statsMap[s._id.toString()] = {
        name: s.name,
        rollNo: s.rollNo,
        fname: s.fname,
        status: s.status,
        subjects: {}
      };
    });

    attendanceDocs.forEach(doc => {
      if (!doc.records) return;
      doc.records.forEach(record => {
        if (!record || !record.studentId) return;
        const studentId = record.studentId.toString();
        if (!statsMap[studentId]) return;

        const subjName = doc.subject || 'Unknown';
        if (!statsMap[studentId].subjects[subjName]) {
          statsMap[studentId].subjects[subjName] = {
            total: 0,
            present: 0,
            absent: 0,
            leave: 0
          };
        }

        const sStats = statsMap[studentId].subjects[subjName];
        sStats.total++;
        if (record.status === 'present') sStats.present++;
        else if (record.status === 'absent') sStats.absent++;
        else if (record.status === 'leave') sStats.leave++;
      });
    });

    // 4. Format the final data
    const result = Object.values(statsMap).map(student => {
      const formattedSubjects = Object.entries(student.subjects).map(([subjectName, stats]) => {
        const percentage = stats.total > 0 
          ? ((stats.present / stats.total) * 100).toFixed(1) 
          : "0.0";
        return {
          subjectName,
          ...stats,
          percentage: parseFloat(percentage)
        };
      });

      // Overall stats for this student
      let totalLectures = 0;
      let totalPresent = 0;
      let totalAbsent = 0;

      formattedSubjects.forEach(sub => {
        totalLectures += sub.total;
        totalPresent += sub.present;
        totalAbsent += sub.absent;
      });

      const overallPercentage = totalLectures > 0 
        ? ((totalPresent / totalLectures) * 100).toFixed(1) 
        : "0.0";

      return {
        ...student,
        subjects: formattedSubjects,
        overall: {
          totalLectures,
          totalPresent,
          totalAbsent,
          percentage: parseFloat(overallPercentage)
        }
      };
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('getStudentStats Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private (Admin)
const getTeachers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const teachers = await User.find({ role: 'teacher' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    const total = await User.countDocuments({ role: 'teacher' });

    const pagination = {
      current: page,
      total: Math.ceil(total / limit),
      count: teachers.length,
      totalRecords: total
    };

    res.status(200).json({
      success: true,
      data: teachers,
      pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create teacher
// @route   POST /api/admin/teachers
// @access  Private (Admin)
const registerTeacher = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      cnic,
      address,
      subjects,
      qualification,
      experience,
      joinDate
    } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phone || !cnic || !address || !qualification || !joinDate) {
      return res.status(400).json({
        success: false,
        error: 'All required fields must be provided'
      });
    }

    // Create teacher with all provided information
    const teacher = await User.create({
      email,
      password,
      role: 'teacher',
      firstName,
      lastName,
      phone,
      cnic,
      address,
      subjects: subjects || [],
      qualification,
      experience: parseInt(experience) || 0,
      joinDate: new Date(joinDate),
      isActive: true
    });

    // Remove password from response
    const teacherResponse = teacher.toObject();
    delete teacherResponse.password;

    res.status(201).json({
      success: true,
      data: teacherResponse,
      message: 'Teacher registered successfully'
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get teacher by ID
// @route   GET /api/admin/teachers/:id
// @access  Private (Admin)
const getTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select('-password');

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update teacher
// @route   PUT /api/admin/teachers/:id
// @access  Private (Admin)
const updateTeacher = async (req, res) => {
  try {
    const { firstName, lastName, phone, isActive } = req.body;

    const teacher = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, phone, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: teacher,
      message: 'Teacher updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete teacher
// @route   DELETE /api/admin/teachers/:id
// @access  Private (Admin)
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);

    if (!teacher || teacher.role !== 'teacher') {
      return res.status(404).json({
        success: false,
        error: 'Teacher not found'
      });
    }

    // Check if teacher has assigned classes
    const assignedClasses = await Class.countDocuments({ teacher: teacher._id });
    if (assignedClasses > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete teacher with assigned classes. Reassign classes first.'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get system settings/stats
// @route   GET /api/admin/system/info
// @access  Private (Admin)
const getSystemInfo = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalStudents,
      activeStudents,
      totalClasses,
      activeClasses,
      totalAttendance
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Student.countDocuments(),
      Student.countDocuments({ status: 'active' }),
      Class.countDocuments(),
      Class.countDocuments({ isActive: true }),
      Attendance.countDocuments()
    ]);

    // Get database size estimate (simplified)
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionStats = {};

    for (const collection of collections) {
      const stats = await mongoose.connection.db.collection(collection.name).stats();
      collectionStats[collection.name] = {
        count: stats.count,
        size: Math.round(stats.size / 1024 / 1024 * 100) / 100 // MB
      };
    }

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers, active: activeUsers },
        students: { total: totalStudents, active: activeStudents },
        classes: { total: totalClasses, active: activeClasses },
        attendance: { total: totalAttendance },
        database: collectionStats,
        server: {
          nodeVersion: process.version,
          environment: process.env.NODE_ENV,
          uptime: Math.round(process.uptime())
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats,
  getTeachers,
  registerTeacher,
  getTeacher,
  updateTeacher,
  deleteTeacher,
  getSystemInfo,
  getStudentStats
};