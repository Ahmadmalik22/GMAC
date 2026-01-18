const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  period: { type: Number, enum: [1,2,3,4,5,6], required: true },
  classLevel: String,
  group: String,
  subject: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  records: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      status: { type: String, enum: ["present", "absent", "leave"], default: "present" }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);