require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../src/models/Student.js');

const activateAllStudents = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const totalStudents = await Student.countDocuments();
        console.log(`📊 Total students in database: ${totalStudents}`);

        // Update ALL students to have status: 'active'
        const result = await Student.updateMany(
            {}, 
            { $set: { status: 'active' } }
        );

        console.log(`✅ Success! Set "active" status for all ${result.matchedCount} students.`);
        
        // Check a sample student to see their subjects
        const sample = await Student.findOne();
        if (sample) {
            console.log('📝 Sample Student Structure:');
            console.log(JSON.stringify(sample, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating students:', error.message);
        process.exit(1);
    }
};

activateAllStudents();
