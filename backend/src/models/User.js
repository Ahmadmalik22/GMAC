const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'teacher'],
      message: 'Role must be either admin or teacher'
    },
    required: [true, 'Please specify user role']
  },
  firstName: {
    type: String,
    required: [true, 'Please add first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^03\d{9}$/.test(v); // Optional but must match format if provided
      },
      message: 'Phone number must be in format 03XXXXXXXXX'
    }
  },
  // Additional fields for teachers
  cnic: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^\d{5}-\d{7}-\d{1}$/.test(v);
      },
      message: 'CNIC must be in format XXXXX-XXXXXXX-X'
    }
  },
  address: {
    type: String,
    maxlength: [500, 'Address cannot be more than 500 characters']
  },
  subjects: [{
    type: String,
    enum: [
      'English', 'Urdu', 'Tarjama', 'Pakistan Studies', 'Islamic Studies',
      'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Computer Science',
      'Economics', 'Civics', 'Physical Education', 'Education'
    ]
  }],
  qualification: {
    type: String,
    enum: {
      values: ['Bachelor', 'Master', 'MPhil', 'PhD', 'B.Ed', 'M.Ed'],
      message: 'Please select a valid qualification'
    }
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    default: 0
  },
  joinDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
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
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Index for better query performance
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);