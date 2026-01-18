const Student = require('../models/Student');

/**
 * Generate a unique roll number for a student
 * Format: [Grade][GroupPrefix]-[SequentialNumber]
 * Example: 11PM-001, 12CS-015, 11FA-028
 */
const generateRollNumber = async (grade, academicGroup) => {
  // Validate inputs
  if (!grade || !['11th', '12th'].includes(grade)) {
    throw new Error('Invalid grade. Must be 11th or 12th');
  }

  if (!academicGroup || !['premed', 'preeng', 'ics', 'fa', 'fa-it'].includes(academicGroup)) {
    throw new Error('Invalid academic group');
  }

  // Get grade prefix
  const gradePrefix = grade === '11th' ? '11' : '12';

  // Get group prefix
  const groupPrefixes = {
    premed: 'PM',
    preeng: 'PE',
    ics: 'CS',
    fa: 'FA',
    'fa-it': 'FIT'
  };

  const groupPrefix = groupPrefixes[academicGroup];

  // Find the highest roll number for this grade and group
  const regex = new RegExp(`^${gradePrefix}${groupPrefix}-\\d{3}$`);
  const lastStudent = await Student.findOne({
    rollNumber: regex
  }).sort({ rollNumber: -1 });

  let nextNumber = 1;

  if (lastStudent) {
    // Extract the number part and increment
    const lastNumber = parseInt(lastStudent.rollNumber.slice(-3));
    nextNumber = lastNumber + 1;
  }

  // Ensure the number is 3 digits with leading zeros
  const formattedNumber = String(nextNumber).padStart(3, '0');

  return `${gradePrefix}${groupPrefix}-${formattedNumber}`;
};

/**
 * Validate roll number format
 */
const validateRollNumber = (rollNumber) => {
  const regex = /^\d{2}[A-Z]{2,3}-\d{3}$/;
  return regex.test(rollNumber);
};

/**
 * Parse roll number to extract grade and group
 */
const parseRollNumber = (rollNumber) => {
  if (!validateRollNumber(rollNumber)) {
    throw new Error('Invalid roll number format');
  }

  const grade = rollNumber.startsWith('11') ? '11th' : '12th';
  const groupPrefix = rollNumber.substring(2, rollNumber.indexOf('-'));

  const groupMap = {
    'PM': 'premed',
    'PE': 'preeng',
    'CS': 'ics',
    'FA': 'fa',
    'FIT': 'fa-it'
  };

  const academicGroup = groupMap[groupPrefix];
  if (!academicGroup) {
    throw new Error('Invalid group prefix in roll number');
  }

  return { grade, academicGroup, sequentialNumber: rollNumber.slice(-3) };
};

module.exports = {
  generateRollNumber,
  validateRollNumber,
  parseRollNumber
};