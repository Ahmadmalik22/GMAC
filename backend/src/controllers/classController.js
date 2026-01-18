const Class = require('../models/Class.js');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private (Admin, Teacher)
const getClasses = async (req, res) => {
  try {
    let query = { isActive: true };

    // Teachers can only see their assigned classes
    if (req.user.role === 'teacher') {
      query.teacher = req.user._id;
    }

    const classes = await Class.find(query)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName rollNumber')
      .sort({ grade: 1, academicGroup: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private (Admin, Teacher)
const getClass = async (req, res) => {
  try {
    const classDoc = await Class.findById(req.params.id)
      .populate('teacher', 'firstName lastName')
      .populate('students', 'firstName lastName rollNumber grade academicGroup');

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    // Teachers can only access their assigned classes
    if (req.user.role === 'teacher' && classDoc.teacher._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this class'
      });
    }

    res.status(200).json({
      success: true,
      data: classDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (Admin)
const createClass = async (req, res) => {
  try {
    const classData = { ...req.body };
    classData.createdBy = req.user._id;

    const classDoc = await Class.create(classData);

    res.status(201).json({
      success: true,
      data: classDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
const updateClass = async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classDoc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
const deleteClass = async (req, res) => {
  try {
    const classDoc = await Class.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!classDoc) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass
};