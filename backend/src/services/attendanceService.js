const Attendance = require('../models/Attendance.js');
const Student = require('../models/Student.js');
const Class = require('../models/Class.js');

// Mark bulk attendance for a class
const markBulkAttendance = async (attendanceData, teacherId) => {
  const { classId, subject, date, attendanceRecords } = attendanceData;

  // Validate inputs
  if (!classId || !subject || !date || !attendanceRecords) {
    throw new Error('Missing required fields: classId, subject, date, attendanceRecords');
  }

  // Validate class exists and teacher has access
  const classDoc = await Class.findById(classId).populate('students');
  if (!classDoc) {
    throw new Error('Class not found');
  }

  if (!classDoc.teacher.equals(teacherId)) {
    throw new Error('Teacher is not assigned to this class');
  }

  // Get valid student IDs for this class
  const validStudentIds = classDoc.students.map(student => student._id.toString());

  // Validate attendance records
  const validRecords = [];
  const errors = [];

  for (const record of attendanceRecords) {
    try {
      // Check if student belongs to class
      if (!validStudentIds.includes(record.studentId)) {
        errors.push(`Student ${record.studentId} does not belong to this class`);
        continue;
      }

      // Check if student has the subject
      const student = classDoc.students.find(s => s._id.toString() === record.studentId);
      const hasSubject = student.subjects.some(s => s.name === subject.name);

      if (!hasSubject) {
        errors.push(`Student ${student.rollNumber} does not have subject: ${subject.name}`);
        continue;
      }

      // Validate status
      if (!['present', 'absent', 'leave'].includes(record.status)) {
        errors.push(`Invalid status for student ${student.rollNumber}: ${record.status}`);
        continue;
      }

      validRecords.push({
        student: record.studentId,
        subject: subject,
        class: classId,
        teacher: teacherId,
        date: new Date(date),
        status: record.status,
        notes: record.notes || '',
        markedBy: teacherId
      });
    } catch (error) {
      errors.push(`Error processing student ${record.studentId}: ${error.message}`);
    }
  }

  // If there are validation errors, throw them
  if (errors.length > 0) {
    throw new Error(`Validation errors: ${errors.join('; ')}`);
  }

  // Process attendance records (upsert)
  const attendancePromises = validRecords.map(async (record) => {
    return Attendance.findOneAndUpdate(
      {
        student: record.student,
        'subject.name': record.subject.name,
        date: record.date
      },
      record,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    );
  });

  const results = await Promise.all(attendancePromises);

  return {
    success: true,
    totalRecords: validRecords.length,
    processedRecords: results.length,
    data: results
  };
};

// Get attendance for a specific class and date
const getClassAttendance = async (classId, date) => {
  const attendanceRecords = await Attendance.find({
    class: classId,
    date: new Date(date)
  })
  .populate('student', 'firstName lastName rollNumber subjects')
  .populate('teacher', 'firstName lastName')
  .sort({ 'student.rollNumber': 1 });

  // Get all students in the class for complete attendance view
  const classDoc = await Class.findById(classId).populate('students', 'firstName lastName rollNumber subjects');

  // Create attendance map
  const attendanceMap = {};
  attendanceRecords.forEach(record => {
    attendanceMap[record.student._id.toString()] = record;
  });

  // Build complete attendance list
  const completeAttendance = classDoc.students.map(student => {
    const attendance = attendanceMap[student._id.toString()];
    return {
      student: {
        _id: student._id,
        rollNumber: student.rollNumber,
        name: `${student.firstName} ${student.lastName}`,
        subjects: student.subjects
      },
      attendance: attendance ? {
        status: attendance.status,
        notes: attendance.notes,
        markedAt: attendance.markedAt,
        markedBy: attendance.teacher
      } : null
    };
  });

  return {
    classId,
    date,
    totalStudents: classDoc.students.length,
    attendanceRecords: completeAttendance,
    summary: {
      present: attendanceRecords.filter(r => r.status === 'present').length,
      absent: attendanceRecords.filter(r => r.status === 'absent').length,
      leave: attendanceRecords.filter(r => r.status === 'leave').length,
      unmarked: classDoc.students.length - attendanceRecords.length
    }
  };
};

// Get student attendance statistics
const getStudentAttendanceStats = async (studentId, startDate, endDate) => {
  const attendanceRecords = await Attendance.find({
    student: studentId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('subject', 'name');

  // Group by subject
  const subjectStats = {};
  attendanceRecords.forEach(record => {
    const subjectName = record.subject.name;
    if (!subjectStats[subjectName]) {
      subjectStats[subjectName] = {
        total: 0,
        present: 0,
        absent: 0,
        leave: 0
      };
    }

    subjectStats[subjectName].total++;
    subjectStats[subjectName][record.status]++;
  });

  // Calculate percentages
  const subjectWiseStats = Object.keys(subjectStats).map(subject => ({
    subject,
    ...subjectStats[subject],
    percentage: subjectStats[subject].total > 0
      ? Math.round((subjectStats[subject].present / subjectStats[subject].total) * 100)
      : 0
  }));

  // Overall statistics
  const overall = attendanceRecords.reduce((acc, record) => {
    acc.total++;
    acc[record.status]++;
    return acc;
  }, { total: 0, present: 0, absent: 0, leave: 0 });

  overall.percentage = overall.total > 0
    ? Math.round((overall.present / overall.total) * 100)
    : 0;

  return {
    studentId,
    dateRange: { startDate, endDate },
    overall,
    subjectWise: subjectWiseStats
  };
};

// Get class attendance report
const getClassAttendanceReport = async (classId, startDate, endDate) => {
  const classDoc = await Class.findById(classId).populate('students', 'firstName lastName rollNumber');

  const attendanceRecords = await Attendance.find({
    class: classId,
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  });

  // Group by student
  const studentStats = {};
  attendanceRecords.forEach(record => {
    const studentId = record.student.toString();
    if (!studentStats[studentId]) {
      studentStats[studentId] = {
        total: 0,
        present: 0,
        absent: 0,
        leave: 0
      };
    }

    studentStats[studentId].total++;
    studentStats[studentId][record.status]++;
  });

  // Build report
  const report = classDoc.students.map(student => {
    const stats = studentStats[student._id.toString()] || { total: 0, present: 0, absent: 0, leave: 0 };
    return {
      student: {
        _id: student._id,
        rollNumber: student.rollNumber,
        name: `${student.firstName} ${student.lastName}`
      },
      attendance: {
        ...stats,
        percentage: stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0
      }
    };
  });

  return {
    classId,
    className: classDoc.name,
    dateRange: { startDate, endDate },
    totalStudents: classDoc.students.length,
    report: report.sort((a, b) => a.student.rollNumber.localeCompare(b.student.rollNumber))
  };
};

// Update attendance record
const updateAttendanceRecord = async (attendanceId, updates, userId) => {
  const attendance = await Attendance.findById(attendanceId);

  if (!attendance) {
    throw new Error('Attendance record not found');
  }

  // Check permissions (teacher can only update their own records within 24 hours)
  if (attendance.teacher.toString() !== userId) {
    throw new Error('Not authorized to update this attendance record');
  }

  // Check if update is within allowed time (24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (attendance.markedAt < twentyFourHoursAgo) {
    throw new Error('Attendance records can only be updated within 24 hours of marking');
  }

  // Update the record
  Object.assign(attendance, updates);
  attendance.markedAt = new Date();

  await attendance.save();

  return attendance;
};

module.exports = {
  markBulkAttendance,
  getClassAttendance,
  getStudentAttendanceStats,
  getClassAttendanceReport,
  updateAttendanceRecord
};