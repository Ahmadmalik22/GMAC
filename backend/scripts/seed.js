const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Student = require('../src/models/Student');
const Attendance = require('../src/models/Attendance');

const subjectsMap = {
  'Pre-Medical': ['Biology', 'Chemistry', 'Physics'],
  'Pre-Engineering': ['Mathematics', 'Chemistry', 'Physics'],
  'ICS': ['Computer Science', 'Mathematics', 'Physics'],
  'FA': ['Economics', 'Civics', 'Education'],
  'ICom': ['Economics', 'Mathematics', 'Civics'] // Using available enum values
};

const allSubjects = [
  'English', 'Urdu', 'Tarjama', 'Pakistan Studies', 'Islamic Studies',
  'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Computer Science',
  'Economics', 'Civics', 'Physical Education', 'Education'
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear existing data (optional, but requested data setup often implies a fresh start)
    // We only clear teachers to avoid deleting admins
    await User.deleteMany({ role: 'teacher' });
    
    try {
      // Drop students collection or indexes to avoid conflicts with old schema (e.g., rollNumber vs rollNo)
      await Student.collection.drop();
      console.log('🗑️ Dropped students collection to refresh schema/indexes.');
    } catch (e) {
      console.log('ℹ️ Students collection did not exist or could not be dropped.');
    }

    await Attendance.deleteMany({});

    console.log('🧹 Cleared existing students, teachers, and attendance records.');

    // 1. Seed Teachers for all subjects
    console.log('👤 Seeding teachers...');
    const teachers = [];
    const plainPassword = 'password123';
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    for (const subject of allSubjects) {
      teachers.push({
        firstName: subject,
        lastName: 'Teacher',
        email: `${subject.toLowerCase().replace(/ /g, '')}@example.com`,
        password: hashedPassword, // Manually hashed because insertMany bypasses pre-save
        role: 'teacher',
        subjects: [subject],
        qualification: 'Master',
        experience: 5,
        phone: '03001234567',
        cnic: `${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000000 + Math.random() * 9000000)}-1`,
        isActive: true
      });
    }

    const createdTeachers = await User.insertMany(teachers);
    console.log(`✅ Created ${createdTeachers.length} teachers. (Password: ${plainPassword})`);

    // 2. Seed 30 Students
    console.log('🎓 Seeding 30 students...');
    const studentsList = [];
    const groups = ["Pre-Medical", "Pre-Engineering", "ICS", "FA", "ICom"];
    
    for (let i = 1; i <= 30; i++) {
      const classLevel = i <= 15 ? '11th' : '12th';
      const group = groups[i % groups.length]; // Distribute groups evenly
      
      // Compulsory subjects
      let subjects = ['English', 'Urdu', 'Tarjama'];
      if (classLevel === '11th') {
        subjects.push('Islamic Studies');
      } else {
        subjects.push('Pakistan Studies');
      }
      
      // Add electives
      subjects = [...subjects, ...subjectsMap[group]];

      studentsList.push({
        rollNo: i.toString(),
        name: `Student ${i}`,
        fname: `Father ${i}`,
        address: `Address Street ${i}, City`,
        contact: 923000000000 + i,
        classLevel,
        group,
        subjects
      });
    }

    const createdStudents = await Student.insertMany(studentsList);
    console.log(`✅ Created ${createdStudents.length} students (Roll No 1 to 30).`);

    // 3. Mark Attendance for 4 days (1 Jan to 4 Jan 2026)
    console.log('📝 Marking attendance for 4 days, 6 periods each...');
    const dates = [
      new Date('2026-01-01'),
      new Date('2026-01-02'),
      new Date('2026-01-03'),
      new Date('2026-01-04')
    ];

    // Attendance model enum only supports [1, 2, 3, 4, 5, 6]
    const periods = [1, 2, 3, 4, 5, 6];
    const attendanceRecords = [];

    for (const date of dates) {
      for (const period of periods) {
        // We create attendance records for each distinct (classLevel, group, subject) combination
        // Since we have teachers for all subjects, we can assume multiple periods running
        
        for (const level of ['11th', '12th']) {
          for (const grp of groups) {
            const groupStudents = createdStudents.filter(s => s.classLevel === level && s.group === grp);
            if (groupStudents.length === 0) continue;

            const possibleSubjects = groupStudents[0].subjects;
            // Pick a subject for this period (simple deterministic rotation)
            const subject = possibleSubjects[(period - 1) % possibleSubjects.length];
            
            // Find teacher for this subject
            const teacher = createdTeachers.find(t => t.subjects.includes(subject));
            if (!teacher) continue;

            const records = groupStudents.map(student => ({
              studentId: student._id,
              status: Math.random() > 0.15 ? 'present' : (Math.random() > 0.5 ? 'absent' : 'leave')
            }));

            attendanceRecords.push({
              date,
              period,
              classLevel: level,
              group: grp,
              subject,
              teacherId: teacher._id,
              records
            });
          }
        }
      }
    }

    // Insert in chunks to avoid large payload issues if any
    const chunkSize = 100;
    for (let i = 0; i < attendanceRecords.length; i += chunkSize) {
      await Attendance.insertMany(attendanceRecords.slice(i, i + chunkSize));
    }
    
    console.log(`✅ Created ${attendanceRecords.length} attendance records total.`);
    console.log('🚀 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    process.exit(1);
  }
};

seedData();