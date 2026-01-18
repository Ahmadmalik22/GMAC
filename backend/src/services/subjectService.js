// Subject combination logic for GMAC College
const SUBJECT_COMBINATIONS = {
  premed: {
    compulsory: ['English', 'Urdu', 'Tarjama'],
    science: ['Biology', 'Chemistry', 'Physics']
  },
  preeng: {
    compulsory: ['English', 'Urdu', 'Tarjama'],
    science: ['Chemistry', 'Mathematics', 'Physics']
  },
  ics: {
    compulsory: ['English', 'Urdu', 'Tarjama'],
    science: ['Computer Science', 'Mathematics'],
    electiveCount: 1,
    availableElectives: ['Economics', 'Civics']
  },
  fa: {
    compulsory: ['English', 'Urdu', 'Tarjama'],
    electiveCount: 2,
    availableElectives: ['Economics', 'Civics', 'Physical Education', 'Education']
  },
  'fa-it': {
    compulsory: ['English', 'Urdu', 'Tarjama'],
    electiveCount: 2,
    availableElectives: ['Economics', 'Civics', 'Physical Education', 'Education']
  }
};

// Get year-specific subject
const getYearSubject = (grade) => {
  return grade === '11th' ? 'Pakistan Studies' : 'Islamic Studies';
};

// Generate subject combination for a student
const generateSubjectCombination = (academicGroup, grade, electives = []) => {
  const combination = SUBJECT_COMBINATIONS[academicGroup];

  if (!combination) {
    throw new Error(`Invalid academic group: ${academicGroup}`);
  }

  const subjects = [
    ...combination.compulsory,
    getYearSubject(grade),
    ...combination.science
  ];

  // Add electives based on group requirements
  if (combination.electiveCount) {
    const requiredElectives = electives.slice(0, combination.electiveCount);
    subjects.push(...requiredElectives);
  }

  return subjects.map(subject => ({
    name: subject,
    code: generateSubjectCode(subject),
    category: getSubjectCategory(subject, combination)
  }));
};

// Generate subject code (first 3 letters)
const generateSubjectCode = (subjectName) => {
  return subjectName.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
};

// Determine subject category
const getSubjectCategory = (subjectName, combination) => {
  if (combination.compulsory.includes(subjectName) ||
      subjectName === getYearSubject('11th') ||
      subjectName === getYearSubject('12th')) {
    return 'compulsory';
  } else if (combination.science && combination.science.includes(subjectName)) {
    return 'science';
  } else {
    return 'elective';
  }
};

// Validate elective selections
const validateElectives = (academicGroup, electives) => {
  const combination = SUBJECT_COMBINATIONS[academicGroup];

  if (!combination) {
    return { valid: false, message: `Invalid academic group: ${academicGroup}` };
  }

  const requiredCount = combination.electiveCount || 0;

  if (electives.length !== requiredCount) {
    return {
      valid: false,
      message: `${academicGroup.toUpperCase()} requires ${requiredCount} elective(s), but ${electives.length} provided`
    };
  }

  // Check if electives are from available options
  if (combination.availableElectives) {
    const invalidElectives = electives.filter(elective =>
      !combination.availableElectives.includes(elective)
    );

    if (invalidElectives.length > 0) {
      return {
        valid: false,
        message: `Invalid electives for ${academicGroup.toUpperCase()}: ${invalidElectives.join(', ')}`
      };
    }
  }

  // Check for duplicate electives
  if (new Set(electives).size !== electives.length) {
    return {
      valid: false,
      message: 'Duplicate electives are not allowed'
    };
  }

  return { valid: true };
};

// Get available electives for an academic group
const getAvailableElectives = (academicGroup) => {
  const combination = SUBJECT_COMBINATIONS[academicGroup];
  return combination?.availableElectives || [];
};

// Get subject combination summary
const getSubjectCombinationSummary = (academicGroup, grade, electives = []) => {
  try {
    const subjects = generateSubjectCombination(academicGroup, grade, electives);
    const yearSubject = getYearSubject(grade);

    return {
      academicGroup: academicGroup.toUpperCase(),
      grade,
      yearSubject,
      totalSubjects: subjects.length,
      compulsorySubjects: subjects.filter(s => s.category === 'compulsory').length,
      scienceSubjects: subjects.filter(s => s.category === 'science').length,
      electiveSubjects: subjects.filter(s => s.category === 'elective').length,
      subjects: subjects,
      electives: electives
    };
  } catch (error) {
    throw new Error(`Failed to generate subject combination: ${error.message}`);
  }
};

module.exports = {
  generateSubjectCombination,
  validateElectives,
  getAvailableElectives,
  getSubjectCombinationSummary,
  getYearSubject,
  SUBJECT_COMBINATIONS
};