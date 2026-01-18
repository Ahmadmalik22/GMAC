import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, attendanceAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  FiSearch, FiEdit2, FiSave, FiX, FiFilter,
  FiCalendar, FiBook, FiUsers, FiClock, FiCheckCircle, FiUser, FiArrowLeft,
  FiTrendingUp, FiActivity, FiUserCheck, FiUserX
} from 'react-icons/fi'

function ViewAttendance() {
  const [filters, setFilters] = useState({
    classLevel: '',
    group: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    period: ''
  })
  const [attendanceData, setAttendanceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [studentSearch, setStudentSearch] = useState('')

  // Edit mode state
  const [editingId, setEditingId] = useState(null)
  const [editStatus, setEditStatus] = useState('')

  const subjects = [
    'English', 'Urdu', 'Tarjama', 'Pakistan Studies', 'Islamic Studies',
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Computer Science',
    'Economics', 'Civics', 'Physical Education', 'Education'
  ]

  const periods = [1, 2, 3, 4, 5, 6]

  useEffect(() => {
    fetchAttendance()
    // eslint-disable-next-line
  }, [])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params = { ...filters };
      Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

      const response = await adminAPI.getAllAttendance(params);
      if (response.data.success) {
        setAttendanceData(response.data.data)
      } else {
        setAttendanceData(response.data.data || [])
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast.error("Failed to fetch attendance records")
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchAttendance()
  }

  const startEdit = (record, studentId) => {
    setEditingId(`${record._id}_${studentId}`)
    setEditStatus(record.status)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditStatus('')
  }

  const saveEdit = async (record) => {
    try {
      const response = await attendanceAPI.updateAttendance(record._id, {
        studentId: record.student._id,
        status: editStatus
      })
      if (response.data.success) {
        toast.success("Attendance updated successfully")
        setEditingId(null)
        setAttendanceData(prev => prev.map(item => {
          if (item._id === record._id && item.student._id === record.student._id) {
            return { ...item, status: editStatus };
          }
          return item;
        }));
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to update attendance")
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  const filteredData = attendanceData.filter(record =>
    record.student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    record.student.rollNo.includes(studentSearch)
  )

  const stats = {
    total: filteredData.length,
    present: filteredData.filter(r => r.status === 'present').length,
    absent: filteredData.filter(r => r.status === 'absent').length,
    leave: filteredData.filter(r => r.status === 'leave').length,
    percentage: filteredData.length > 0
      ? Math.round((filteredData.filter(r => r.status === 'present').length / filteredData.length) * 100)
      : 0
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-lg"></div>
          <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading Attendance Records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-xl text-white shadow-indigo-200 shadow-lg">
                <FiActivity size={24} />
              </span>
              Attendance Ledger
            </h1>
            <p className="mt-2 text-slate-500 font-medium ml-1">
              Detailed tracking and management of student attendance.
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Dashboard
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <FiUsers size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Records</p>
              <p className="text-2xl font-black text-slate-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <FiUserCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present</p>
              <p className="text-2xl font-black text-slate-800">{stats.present}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <FiUserX size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent</p>
              <p className="text-2xl font-black text-slate-800">{stats.absent}</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <FiTrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance %</p>
              <p className="text-2xl font-black text-slate-800">{stats.percentage}%</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <FiFilter className="text-indigo-500" />
                <span>Filters & Search</span>
              </div>

              <div className="relative w-full max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name or roll number..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
            </div>

            <form onSubmit={handleSearch} className="mt-6 grid grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Class</label>
                <select
                  name="classLevel"
                  value={filters.classLevel}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                >
                  <option value="">All Classes</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Group</label>
                <select
                  name="group"
                  value={filters.group}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                >
                  <option value="">All Groups</option>
                  <option value="Pre-Medical">Pre-Medical</option>
                  <option value="Pre-Engineering">Pre-Engineering</option>
                  <option value="ICS">ICS</option>
                  <option value="FA">FA</option>
                  <option value="ICom">ICom</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Subject</label>
                <select
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Period</label>
                <select
                  name="period"
                  value={filters.period}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                >
                  <option value="">All Periods</option>
                  {periods.map(p => <option key={p} value={p}>Period {p}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
                >
                  {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FiSearch /> Apply</>}
                </button>
              </div>
            </form>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Period</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Class Info</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                          <FiSearch size={48} />
                        </div>
                        <p className="text-slate-500 font-medium">No attendance records matching your criteria.</p>
                        <button
                          onClick={() => {
                            setFilters({
                              classLevel: '',
                              group: '',
                              subject: '',
                              date: new Date().toISOString().split('T')[0],
                              period: ''
                            })
                            setStudentSearch('')
                          }}
                          className="text-indigo-600 font-bold hover:underline"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record) => {
                    const studentUniqueId = `${record._id}_${record.student._id}`;
                    const isEditing = editingId === studentUniqueId;

                    return (
                      <tr key={studentUniqueId} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="flex-shrink-0 h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-100">
                              P{record.period}
                            </span>
                            <div>
                              <p className="text-sm font-bold text-slate-700">{formatDate(record.date)}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-indigo-400 transition-colors">Period Session</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 leading-none">{record.classLevel} • {record.group}</span>
                            <span className="text-sm font-bold text-slate-700 mt-1">{record.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 overflow-hidden">
                              <FiUser className="h-4 w-4" />
                            </div>
                            <span className="text-sm text-slate-600 font-semibold">
                              {record.teacher ? `${record.teacher.firstName} ${record.teacher.lastName}` : 'System Admin'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-black rounded border border-slate-200">{record.student.rollNo}</span>
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800 tracking-tight">{record.student.name}</span>
                              {record.student.status === 'struck-off' && (
                                <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 rounded-full uppercase w-fit mt-0.5 leading-tight tracking-tighter">Struck Off</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          {isEditing ? (
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-32 px-3 py-1.5 text-xs font-bold border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white shadow-sm"
                            >
                              <option value="present">PRESENT</option>
                              <option value="absent">ABSENT</option>
                              <option value="leave">LEAVE</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter border-2
                              ${record.status === 'present'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50'
                                : record.status === 'absent'
                                  ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50'
                                  : 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm shadow-amber-50'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full mr-2 ${record.status === 'present' ? 'bg-emerald-500' :
                                record.status === 'absent' ? 'bg-rose-500' : 'bg-amber-500'
                                }`}></span>
                              {record.status}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(record)}
                                  className="p-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl shadow-lg shadow-emerald-100 transition-all hover:scale-105 active:scale-95"
                                  title="Save Changes"
                                >
                                  <FiSave size={14} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-2 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                                  title="Cancel Edit"
                                >
                                  <FiX size={14} />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => startEdit(record, record.student._id)}
                                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                                title="Edit Attendance"
                              >
                                <FiEdit2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Table Stats */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <FiCheckCircle className="text-emerald-500 h-3.5 w-3.5" />
                <span>Verified Records: {filteredData.length}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-500 italic">AMS v2.0 Professional</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewAttendance