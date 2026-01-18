const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [100, 'Class name cannot be more than 100 characters']
  },
  grade: {
    type: String,
    enum: {
      values: ['11th', '12th'],
      message: 'Grade must be either 11th or 12th'
    },
    required: [true, 'Grade is required']
  },
  academicGroup: {
    type: String,
    enum: {
      values: ['premed', 'preeng', 'ics', 'fa', 'fa-it'],
      message: 'Invalid academic group'
    },
    required: [true, 'Academic group is required']
  },
  capacity: {
    type: Number,
    required: [true, 'Class capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [100, 'Capacity cannot exceed 100']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Class teacher is required']
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  currentEnrollment: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  academicYear: {
    type: String,
    default: function() {
      const now = new Date();
      const year = now.getFullYear();
      return `${year}-${year + 1}`;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
classSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.currentEnrollment = this.students.length;
  next();
});

// Virtual for available seats
classSchema.virtual('availableSeats').get(function() {
  return this.capacity - this.currentEnrollment;
});

// Ensure virtual fields are serialized
classSchema.set('toJSON', { virtuals: true });
classSchema.set('toObject', { virtuals: true });

// Indexes for better query performance
classSchema.index({ grade: 1, academicGroup: 1 });
classSchema.index({ teacher: 1 });
classSchema.index({ isActive: 1 });
classSchema.index({ academicYear: 1 });

// Static method to get classes by teacher
classSchema.statics.getClassesByTeacher = function(teacherId) {
  return this.find({ teacher: teacherId, isActive: true })
    .populate('teacher', 'firstName lastName email')
    .populate('students', 'firstName lastName rollNumber');
};

// Static method to get available classes for a grade/group
classSchema.statics.getAvailableClasses = function(grade, academicGroup) {
  return this.find({
    grade,
    academicGroup,
    isActive: true,
    $expr: { $lt: ['$currentEnrollment', '$capacity'] }
  });
};

module.exports = mongoose.model('Class', classSchema);