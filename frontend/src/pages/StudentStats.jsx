import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  FiSearch, FiFilter, FiCalendar, FiUsers, FiBook,
  FiArrowLeft, FiBarChart2, FiLayers, FiInfo, FiChevronDown, FiChevronUp, FiPieChart, FiTrendingUp
} from 'react-icons/fi'

function StudentStats() {
  const [filters, setFilters] = useState({
    classLevel: 'all',
    group: 'all',
    startDate: '2026-01-01',
    endDate: new Date().toISOString().split('T')[0],
  })

  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRow, setExpandedRow] = useState(null)

  const classLevels = ['all', '11th', '12th']
  const groups = ['all', "Pre-Medical", "Pre-Engineering", "ICS", "FA", "ICom"]

  const fetchStats = async () => {
    const { startDate, endDate } = filters;
    const today = new Date().toISOString().split('T')[0];
    const systemStart = '2026-01-01';

    // Date Validations
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (startDate < systemStart) {
      toast.error("System only handles data from January 1, 2026 onwards");
      return;
    }

    if (endDate > today) {
      toast.error("End date cannot be in the future");
      return;
    }

    if (startDate > endDate) {
      toast.error("Start date cannot be after the end date");
      return;
    }

    setLoading(true)
    try {
      const response = await adminAPI.getStudentStats(filters)
      if (response.data.success) {
        setStatsData(response.data.data)
        if (response.data.data.length === 0) {
          toast.error("No records found for the selected criteria");
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchStats()
  }

  const toggleRow = (rollNo) => {
    setExpandedRow(expandedRow === rollNo ? null : rollNo)
  }

  // Filter the displayed data based on student name or roll number
  const filteredData = statsData.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.includes(searchTerm)
  )

  const aggregateStats = {
    totalStudents: filteredData.length,
    avgAttendance: filteredData.length > 0
      ? Math.round(filteredData.reduce((acc, curr) => acc + curr.overall.percentage, 0) / filteredData.length)
      : 0
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-xl text-white shadow-indigo-200 shadow-lg">
                <FiBarChart2 size={24} />
              </span>
              Performance Analytics
            </h1>
            <p className="mt-2 text-slate-500 font-medium ml-1">
              Analyze student attendance trends and subject-wise consistency.
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold">
              <FiFilter className="text-indigo-500" />
              <span>Analysis Parameters</span>
            </div>
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">Class Level</label>
                <select
                  name="classLevel"
                  value={filters.classLevel}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                >
                  {classLevels.map(l => (
                    <option key={l} value={l}>
                      {l === 'all' ? 'All Classes' : `${l} Class`}
                    </option>
                  ))}
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
                  {groups.map(g => (
                    <option key={g} value={g}>
                      {g === 'all' ? 'All Groups' : g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">From Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 ml-1">To Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium transition-all"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-md shadow-indigo-100 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
                >
                  {loading ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Generate Stats"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Global Stats Summary */}
        {statsData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FiUsers size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
                <p className="text-2xl font-black text-slate-800">{aggregateStats.totalStudents}</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FiTrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Attendance</p>
                <p className="text-2xl font-black text-slate-800">{aggregateStats.avgAttendance}%</p>
              </div>
            </div>
            <div className="relative flex items-center">
              <div className="relative w-full">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter results by name or roll..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm shadow-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4 text-left">Student Info</th>
                  <th className="px-6 py-4 text-center">Lecs</th>
                  <th className="px-6 py-4 text-center">Pres</th>
                  <th className="px-6 py-4 text-center">Abs</th>
                  <th className="px-6 py-4 text-center">Attendance %</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                          <FiLayers size={48} />
                        </div>
                        <p className="text-slate-500 font-medium">No results found.</p>
                        <p className="text-xs text-slate-400 italic">Adjust your filters or initiate a new search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map(student => (
                    <React.Fragment key={student.rollNo}>
                      <tr className={`hover:bg-indigo-50/20 transition-colors group cursor-pointer ${expandedRow === student.rollNo ? 'bg-indigo-50/30' : ''}`} onClick={() => toggleRow(student.rollNo)}>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-100">
                              {student.rollNo}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-800 tracking-tight">{student.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">S/O {student.fname}</p>
                                {student.status === 'struck-off' && (
                                  <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 rounded-full uppercase leading-tight">Struck Off</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center text-sm font-bold text-slate-600">
                          {student.overall.totalLectures}
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-black rounded-lg">
                            {student.overall.totalPresent}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <span className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-black rounded-lg">
                            {student.overall.totalAbsent}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            <span className={`text-sm font-black ${student.overall.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {student.overall.percentage}%
                            </span>
                            <div className="w-16 bg-slate-100 rounded-full h-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${student.overall.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{ width: `${student.overall.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <button
                            className={`p-2 rounded-xl transition-all ${expandedRow === student.rollNo ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                          >
                            <FiChevronDown size={14} />
                          </button>
                        </td>
                      </tr>
                      {expandedRow === student.rollNo && (
                        <tr className="bg-slate-50/50">
                          <td colSpan="6" className="px-10 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {student.subjects.map(sub => (
                                <div key={sub.subjectName} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group/card hover:border-indigo-200 transition-colors">
                                  <div className="absolute top-0 right-0 p-1">
                                    <div className={`h-1.5 w-1.5 rounded-full ${sub.percentage >= 75 ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                                  </div>
                                  <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-tight truncate pr-2" title={sub.subjectName}>
                                      {sub.subjectName}
                                    </h4>
                                    <span className={`text-[10px] font-black ${sub.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {sub.percentage}%
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-3 gap-2 mb-3">
                                    <div className="text-center">
                                      <p className="text-[8px] font-bold text-slate-400 uppercase">Lecs</p>
                                      <p className="text-xs font-bold text-slate-700">{sub.total}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[8px] font-bold text-emerald-400 uppercase">Pres</p>
                                      <p className="text-xs font-bold text-slate-700">{sub.present}</p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-[8px] font-bold text-rose-400 uppercase">Abs</p>
                                      <p className="text-xs font-bold text-slate-700">{sub.absent}</p>
                                    </div>
                                  </div>

                                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all duration-700 ${sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                      style={{ width: `${sub.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <FiPieChart className="text-indigo-500" />
              <span>Performance Insights Engine Active</span>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Good ({'>'}75%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                Low ({'<'}75%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentStats
