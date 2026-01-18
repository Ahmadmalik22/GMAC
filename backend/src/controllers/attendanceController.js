const Attendance = require('../models/Attendance.js');
const Student = require('../models/Student.js');

// @desc    Mark attendance (or update if exists)
// @route   POST /api/attendance/mark
// @access  Private (Teacher)
const markAttendance = async (req, res) => {
  try {
    const { date, period, classLevel, group, subject, records } = req.body;

    if (!date || !period || !classLevel || !group || !subject || !records) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Upsert the attendance document based on unique composite key (date, period, classLevel, group, subject)
    // In many systems, "one teacher, one period" is unique, or "one class group, one period" is unique.
    // The schema doesn't strictly enforce unique index yet on (date, period, class, group, subject) but logic suggests so.
    
    // We'll try to find an existing record to update, or create new.
    const query = {
      date: new Date(date),
      period,
      classLevel,
      group,
      subject
    };

    const update = {
      ...query,
      teacherId: req.user._id,
      records
    };

    const result = await Attendance.findOneAndUpdate(query, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Attendance saved successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get attendance records (View Attendance Page)
// @route   GET /api/attendance/records
// @access  Private (Admin/Teacher)
const getAttendanceRecords = async (req, res) => {
  try {
    const { classLevel, group, subject, date, status, limit = 50, period } = req.query;
    let query = {};

    if (classLevel) query.classLevel = classLevel;
    if (group) query.group = group;
    if (subject) query.subject = subject;
    if (period) query.period = parseInt(period);
    if (date) {
      // Date matching usually needs a range for full day if time is stored, but schema has Date type.
      // If client sends YYYY-MM-DD, we should match that day.
      const start = new Date(date);
      start.setHours(0,0,0,0);
      const end = new Date(date);
      end.setHours(23,59,59,999);
      query.date = { $gte: start, $lte: end };
    }

    // Note: 'status' filter is tricky because status is inside the records array.
    // If we want to find "Attendance Documents containing at least one student with status X", we can query.
    // But usually ViewAttendance wants a flat list of "Student was X".
    // Handling this aggregation in MongoDB is best.

    const pipeline = [
      { $match: query },
      // Unwind records to handle them individually
      { $unwind: '$records' },
      // Populate student info
      {
        $lookup: {
          from: 'students',
          localField: 'records.studentId',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: '$studentInfo' }
    ];

    // Filter by specific status if requested
    if (status) {
      pipeline.push({ $match: { 'records.status': status } });
    }

    // Flatten logic for response
    pipeline.push({
      $project: {
        _id: 1, // Attendance Doc ID
        date: 1,
        period: 1,
        classLevel: 1,
        group: 1,
        subject: 1,
        teacherId: 1,
        status: '$records.status',
        student: {
          _id: '$studentInfo._id',
          rollNo: '$studentInfo.rollNo',
          name: '$studentInfo.name',
          fname: '$studentInfo.fname',
          status: '$studentInfo.status'
        }
      }
    });

    // Populate teacher info
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'teacherId',
        foreignField: '_id',
        as: 'teacherInfo'
      }
    });
    pipeline.push({
      $addFields: {
        teacher: { $arrayElemAt: ['$teacherInfo', 0] }
      }
    });
    pipeline.push({
      $project: { teacherInfo: 0, 'teacher.password': 0 } // Hide sensitive info
    });

    // Sorting and Limiting
    pipeline.push({ $sort: { date: -1, period: 1 } });
    if (limit) pipeline.push({ $limit: parseInt(limit) });

    const records = await Attendance.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update single record (from View Attendance edit)
// @route   PUT /api/attendance/:id
const updateAttendance = async (req, res) => {
    // This is tricky now because we have one doc with many records.
    // The frontend sends an ID. In my previous flatten logic, I sent the Attendance Doc ID as _id.
    // But multiple rows in table might share the same Attendance Doc ID.
    // Ideally, we need (AttendanceID, StudentID) pair to update specific status.
    
    // Changing the logic: The frontend likely calls update with an ID. 
    // If we want to support editing a single student's status, the API needs:
    // PUT /api/attendance/:id (where id is likely the collection ID or a composite).
    // Let's assume the frontend sends the Attendance Document ID, and the body contains { studentId, status }.
    
    try {
        const { studentId, status } = req.body;
        if (!studentId || !status) return res.status(400).json({success: false, error: "Missing studentId or status"});

        const attendance = await Attendance.findOneAndUpdate(
            { _id: req.params.id, "records.studentId": studentId },
            { $set: { "records.$.status": status } },
            { new: true }
        );

        res.status(200).json({ success: true, data: attendance });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

// Stub for summary if needed, or remove if not requested yet. 
// User asked for "viewattance shoud working".
const getAttendanceSummary = async (req, res) => {
  try {
    const { date } = req.query;
    // Default to today if no date provided
    const targetDate = date ? new Date(date) : new Date();
    
    // Normalize date to start/end of day local time roughly, or use UTC if project demands.
    // Assuming simple date match for now.
    const start = new Date(targetDate); 
    start.setHours(0,0,0,0);
    const end = new Date(targetDate); 
    end.setHours(23,59,59,999);

    const pipeline = [
      { $match: { date: { $gte: start, $lte: end } } },
      { $unwind: '$records' },
      {
        $group: {
          _id: '$records.status',
          count: { $sum: 1 }
        }
      }
    ];

    const stats = await Attendance.aggregate(pipeline);
    
    // Format output
    const summary = {
      present: 0,
      absent: 0,
      leave: 0,
      total: 0
    };

    stats.forEach(s => {
      // s._id is the status string
      if (summary.hasOwnProperty(s._id)) {
        summary[s._id] = s.count;
      }
      summary.total += s.count; // Total records checked
    });

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  markAttendance,
  getAttendanceRecords,
  updateAttendance,
  getAttendanceSummary
};