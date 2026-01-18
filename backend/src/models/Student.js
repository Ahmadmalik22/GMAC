const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fname: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: Number, required: true },
  classLevel: { type: String, enum: ["11th", "12th"], required: true },
  group: { type: String, enum: ["Pre-Medical", "Pre-Engineering", "ICS", "FA", "ICom"], required: true },
  subjects: [String],
  status: { type: String, enum: ["active", "struck-off"], default: "active" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);