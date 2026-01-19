import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { attendanceAPI, studentAPI } from '../services/api'
import toast from 'react-hot-toast'

function MarkAttendance() {
  // Selection States
  const [classLevel, setClassLevel] = useState('')
  const [group, setGroup] = useState('')
  const [subject, setSubject] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [period, setPeriod] = useState(1) // Default Period 1

  // Data States
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showStudentList, setShowStudentList] = useState(false)

  // Quick Mark State
  const [absentRolls, setAbsentRolls] = useState('')

  // Attendance State
  const [attendanceMap, setAttendanceMap] = useState({}) // studentId -> status

  // Available subjects for autocomplete/dropdown (could be dynamic but hardcoded for now based on AddStudent)
  const availableSubjects = [
    "Mathematics", "English", "Physics", "Chemistry", "Urdu", "Tarjama",
    "Computer Science", "Economics", "Physical Education",
    "Pakistan Studies", "Islamic Studies", "Civics", "Education", "Biology"
  ]

  const fetchStudents = async () => {
    if (!classLevel || !group || !subject) {
      toast.error('Please select Class, Group and Subject')
      return
    }

    setLoading(true)
    try {
      const response = await studentAPI.getStudents({ classLevel, group })
      if (response.data && response.data.data) {
        const allStudents = response.data.data;

        if (allStudents.length === 0) {
          toast(`No active students found in ${classLevel} - ${group}`, { icon: 'ℹ️' })
          setStudents([])
          setShowStudentList(false)
          setLoading(false)
          return
        }

        // Filter students by subject (case-insensitive and trimmed)
        const searchSubject = subject.trim().toLowerCase();
        const filteredStudents = allStudents.filter(s =>
          s.subjects && s.subjects.some(sub => sub.trim().toLowerCase() === searchSubject)
        )

        if (filteredStudents.length === 0) {
          toast(`Found ${allStudents.length} students in this class, but none are enrolled in "${subject}"`, { icon: '⚠️' })
          setStudents([])
          setShowStudentList(false)
        } else {
          setStudents(filteredStudents)
          // Initialize all as present by default
          const initialMap = {}
          filteredStudents.forEach(s => {
            initialMap[s._id] = 'present'
          })
          setAttendanceMap(initialMap)
          setShowStudentList(true)
          toast.success(`Found ${filteredStudents.length} students`)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleQuickMark = (e) => {
    e.preventDefault()
    if (!absentRolls.trim()) {
      // If empty, mark all present (reset)
      const newMap = {}
      students.forEach(s => newMap[s._id] = 'present')
      setAttendanceMap(newMap)
      toast.success('Reset all to Present')
      return
    }

    const rollList = absentRolls.split(',').map(r => r.trim()).filter(r => r)
    const newMap = {}
    let matchCount = 0

    students.forEach(s => {
      if (rollList.includes(s.rollNo)) {
        newMap[s._id] = 'absent'
        matchCount++
      } else {
        newMap[s._id] = 'present'
      }
    })

    setAttendanceMap(newMap)
    toast.success(`Marked ${matchCount} students as Absent, others Present`)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const records = Object.keys(attendanceMap).map(studentId => ({
        studentId,
        status: attendanceMap[studentId]
      }))

      const payload = {
        date,
        period: parseInt(period),
        classLevel,
        group,
        subject,
        records
      }

      const response = await attendanceAPI.markAttendance(payload)
      if (response.data.success) {
        toast.success('Attendance marked successfully')
        // We keep the list open so teacher can see what was submitted, or close it.
        // Let's clear logic to reset for next:
        setShowStudentList(false)
        setStudents([])
        setAttendanceMap({})
        setAbsentRolls('')
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to submit attendance')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-govt-gray-light py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
            <p className="text-gray-600">Enter details to mark attendance</p>
          </div>
          <Link to="/teacher/dashboard" className="text-blue-600 hover:text-blue-800">Back to Dashboard</Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Class Level</label>
              <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="">Select Level</option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Group</label>
              <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="">Select Group</option>
                <option value="Pre-Medical">Pre-Medical</option>
                <option value="Pre-Engineering">Pre-Engineering</option>
                <option value="ICS">ICS</option>
                <option value="FA">FA</option>
                <option value="ICom">ICom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <input
                list="subjects-list"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Type or select Subject"
              />
              <datalist id="subjects-list">
                {availableSubjects.map(sub => <option key={sub} value={sub} />)}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={fetchStudents}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search Students'}
            </button>
          </div>
        </div>

        {/* Student List */}
        {showStudentList && (
          <div className="space-y-6">

            {/* Quick Mark Box */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-blue-800 mb-2">Quick Mark Absent</h3>
              <p className="text-sm text-blue-600 mb-4">
                Enter Roll Numbers of absent students (comma separated) to automatically mark them Absent and everyone else Present.
              </p>
              <form onSubmit={handleQuickMark} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={absentRolls}
                  onChange={(e) => setAbsentRolls(e.target.value)}
                  placeholder="e.g. 11-FSC-001, 11-FSC-005"
                  className="w-full border border-blue-300 rounded-lg px-4 py-3 sm:py-2 focus:ring-2 focus:ring-blue-500 outline-none text-base"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 sm:py-2 rounded-lg hover:bg-blue-700 transition font-bold sm:font-medium whitespace-nowrap shadow-md active:scale-95"
                >
                  Auto Fill
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Student List ({students.length})</h3>
                <div className="text-sm text-gray-500">Subject: <span className="font-semibold text-gray-700">{subject}</span></div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Roll No</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                      <th className="px-3 sm:px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">{student.rollNo}</td>
                        <td className="px-3 sm:px-6 py-4 text-sm text-gray-900">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold sm:font-normal">{student.name}</span>
                            {student.status === 'struck-off' && (
                              <span className="w-fit text-[9px] font-black bg-rose-500 text-white px-1.5 rounded-full uppercase leading-tight">Struck Off</span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 sm:px-6 py-4 text-center">
                          <div className="flex flex-wrap justify-center gap-2">
                            {['present', 'absent', 'leave'].map(status => (
                              <button
                                key={status}
                                onClick={() => handleStatusChange(student._id, status)}
                                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium capitalize transition-all duration-200 ${attendanceMap[student._id] === status
                                  ? (status === 'present' ? 'bg-green-600 text-white shadow-md transform scale-105' :
                                    status === 'absent' ? 'bg-red-600 text-white shadow-md transform scale-105' :
                                      'bg-yellow-500 text-white shadow-md transform scale-105')
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                              >
                                {status.charAt(0).toUpperCase()}
                                <span className="hidden sm:inline">{status.slice(1)}</span>
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 sm:p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full sm:w-auto bg-green-600 text-white px-8 py-4 sm:py-3 rounded-xl sm:rounded-lg hover:bg-green-700 transition shadow-lg disabled:opacity-50 font-bold text-lg flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Submit Attendance'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkAttendance
