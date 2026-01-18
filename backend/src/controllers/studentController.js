const Student = require('../models/Student.js');

// @desc    Get all students (with filtering)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { classLevel, group, rollNo, name, status } = req.query;
    let query = {};

    if (classLevel) query.classLevel = classLevel;
    if (group) query.group = group;
    if (rollNo) query.rollNo = { $regex: rollNo, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };
    
    // If status is provided, use it. Otherwise, default to 'active' if we want to hide struck-off students
    // However, the admin needs to see all students. So we might need to check if user is admin.
    // For now, let's allow 'status' override. If not provided, we return all (or we could default to active).
    // The user said: "if the student struct off the teacher cannot mark the attance of struck off student"
    // So for teacher, it must be 'active'.
    if (status) {
      query.status = status;
    } else if (req.user && req.user.role === 'teacher') {
      query.status = 'active';
    }

    const students = await Student.find(query).sort({ rollNo: 1 });

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res, next) => {
  try {
    console.log('Create Student Request Body:', JSON.stringify(req.body, null, 2));
    const { rollNo, name, fname, address, contact, classLevel, group, subjects } = req.body;

    // Check if student exists
    const studentExists = await Student.findOne({ rollNo });
    if (studentExists) {
      console.log('Student exists with rollNo:', rollNo);
      return res.status(400).json({ success: false, error: 'Student with this roll number already exists' });
    }

    const student = await Student.create({
      rollNo,
      name,
      fname,
      address,
      contact,
      classLevel,
      group,
      subjects
    });

    res.status(201).json({
      success: true,
      data: student,
      message: 'Student registered successfully'
    });
  } catch (error) {
    console.error('Create Student Error:', error);
    // Pass to global error handler to handle ValidationErrors correctly
    next(error); 
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student,
      message: 'Student updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent
};