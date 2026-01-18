const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Student = require('../src/models/Student');
const Attendance = require('../src/models/Attendance');

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected');

    const classLevel = '12th';
    const group = 'ICS';
    const startDate = '2025-12-01';
    const endDate = '2026-01-04';

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    console.log('Querying students...');
    const students = await Student.find({ classLevel, group }).sort({ rollNo: 1 });
    console.log('Students found:', students.length);

    if (students.length === 0) {
      console.log('No students');
      process.exit(0);
    }

    console.log('Querying attendance docs...');
    const attendanceDocs = await Attendance.find({
      classLevel,
      group,
      date: { $gte: start, $lte: end }
    });
    console.log('Attendance docs found:', attendanceDocs.length);

    const statsMap = {};
    students.forEach(s => {
      statsMap[s._id.toString()] = {
        name: s.name,
        rollNo: s.rollNo,
        fname: s.fname,
        subjects: {}
      };
    });

    attendanceDocs.forEach(doc => {
      doc.records.forEach(record => {
        if (!record.studentId) return;
        const studentId = record.studentId.toString();
        if (!statsMap[studentId]) return;

        if (!statsMap[studentId].subjects[doc.subject]) {
          statsMap[studentId].subjects[doc.subject] = {
            total: 0,
            present: 0,
            absent: 0,
            leave: 0
          };
        }

        const sStats = statsMap[studentId].subjects[doc.subject];
        sStats.total++;
        if (record.status === 'present') sStats.present++;
        else if (record.status === 'absent') sStats.absent++;
        else if (record.status === 'leave') sStats.leave++;
      });
    });

    console.log('Processing results...');
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

    console.log('Success! Result size:', result.length);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

test();
