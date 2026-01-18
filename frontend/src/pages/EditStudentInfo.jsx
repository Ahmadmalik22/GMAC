import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI } from '../services/api'
import toast from 'react-hot-toast'
import {
  FiSearch, FiEdit2, FiSave, FiX, FiUserPlus,
  FiArrowLeft, FiUser, FiInfo, FiToggleLeft, FiToggleRight,
  FiMapPin, FiPhone, FiBookOpen, FiActivity, FiFilter
} from 'react-icons/fi'

function EditStudentInfo() {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  const subjectOptions = [
    "Mathematics", "English", "Physics", "Chemistry", "Urdu", "Tarjama",
    "Computer Science", "Economics", "Physical Education", "Biology",
    "Pakistan Studies", "Islamic Studies", "Civics", "Education"
  ]

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const response = await studentAPI.getStudents()
      setStudents(response.data.data || [])
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
    setEditForm({
      ...student,
      contact: student.contact?.toString() || ''
    })
    setIsEditing(false) // Start in view mode
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubjectToggle = (subject) => {
    const currentSubjects = editForm.subjects || []
    if (currentSubjects.includes(subject)) {
      setEditForm(prev => ({
        ...prev,
        subjects: currentSubjects.filter(s => s !== subject)
      }))
    } else {
      setEditForm(prev => ({
        ...prev,
        subjects: [...currentSubjects, subject]
      }))
    }
  }

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'active' ? 'struck-off' : 'active'
    try {
      const response = await studentAPI.updateStudent(student._id, { status: newStatus })
      if (response.data.success) {
        toast.success(`Student ${newStatus === 'active' ? 'Re-enrolled' : 'Struck Off'} successfully`)
        // Update both local states
        const updatedStudent = { ...student, status: newStatus }
        setStudents(prev => prev.map(s => s._id === student._id ? updatedStudent : s))
        if (selectedStudent?._id === student._id) {
          setSelectedStudent(updatedStudent)
          setEditForm(prev => ({ ...prev, status: newStatus }))
        }
      }
    } catch (error) {
      toast.error('Failed to update student status')
    }
  }

  const handleSaveChanges = async () => {
    setSaving(true)
    try {
      const payload = {
        ...editForm,
        contact: Number(editForm.contact)
      }
      const response = await studentAPI.updateStudent(selectedStudent._id, payload)
      if (response.data.success) {
        toast.success('Information updated successfully')
        const updated = response.data.data
        setStudents(prev => prev.map(s => s._id === updated._id ? updated : s))
        setSelectedStudent(updated)
        setIsEditing(false)
      }
    } catch (error) {
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.fname.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span className="p-2 bg-indigo-600 rounded-xl text-white shadow-indigo-200 shadow-lg">
                <FiActivity size={24} />
              </span>
              Student Information Hub
            </h1>
            <p className="mt-2 text-slate-500 font-medium ml-1">
              Manage records, update details, and handle enrollment status.
            </p>
          </div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
          >
            <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Panel: Search & List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Roll No, Name, or Father..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                />
              </div>

              <div className="max-h-[600px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredStudents.map(student => (
                  <button
                    key={student._id}
                    onClick={() => handleSelectStudent(student)}
                    className={`w-full text-left p-4 rounded-xl transition-all border ${selectedStudent?._id === student._id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                      : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-700'
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${selectedStudent?._id === student._id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500'
                        }`}>
                        {student.rollNo}
                      </span>
                      {student.status === 'struck-off' && (
                        <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 rounded-full uppercase">Struck Off</span>
                      )}
                    </div>
                    <p className="font-black text-sm mt-2 truncate">{student.name}</p>
                    <p className={`text-[11px] font-bold uppercase tracking-wider mt-1 ${selectedStudent?._id === student._id ? 'text-indigo-100' : 'text-slate-400'
                      }`}>
                      {student.classLevel} • {student.group}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Detail & Edit */}
          <div className="lg:col-span-8">
            {!selectedStudent ? (
              <div className="h-full min-h-[500px] bg-white rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <div className="p-6 bg-slate-50 rounded-full mb-4">
                  <FiUser size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-500">No Student Selected</h3>
                <p className="text-sm font-medium mt-2">Choose a student from the ledger to view or edit their profile.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
                {/* Profile Header */}
                <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 relative">
                      <FiUser size={32} />
                      {selectedStudent.status === 'struck-off' && (
                        <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center">
                          <FiX size={12} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedStudent.name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase">
                          {selectedStudent.rollNo}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${selectedStudent.status === 'struck-off' ? 'text-rose-500' : 'text-emerald-500'
                          }`}>
                          • {selectedStudent.status === 'struck-off' ? 'STRUCK OFF' : 'ENROLLED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedStudent)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedStudent.status === 'struck-off'
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white'
                        }`}
                    >
                      {selectedStudent.status === 'struck-off' ? <><FiToggleLeft size={16} /> Enroll Now</> : <><FiToggleRight size={16} /> Struck Off</>}
                    </button>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isEditing
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                        }`}
                    >
                      {isEditing ? <><FiX /> Cancel</> : <><FiEdit2 /> Edit Info</>}
                    </button>
                  </div>
                </div>

                {/* Profile Grid / Form */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  {isEditing ? (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Student Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={editForm.name}
                            onChange={handleEditChange}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Father's Name</label>
                          <input
                            type="text"
                            name="fname"
                            value={editForm.fname}
                            onChange={handleEditChange}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                          <input
                            type="text"
                            name="contact"
                            value={editForm.contact}
                            onChange={handleEditChange}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Class Level</label>
                          <select
                            name="classLevel"
                            value={editForm.classLevel}
                            onChange={handleEditChange}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700"
                          >
                            <option value="11th">11th</option>
                            <option value="12th">12th</option>
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Home Address</label>
                          <textarea
                            name="address"
                            value={editForm.address}
                            onChange={handleEditChange}
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-700"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Subject Enrolment</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {subjectOptions.map(sub => (
                            <button
                              key={sub}
                              onClick={() => handleSubjectToggle(sub)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${editForm.subjects?.includes(sub)
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                : 'bg-white border-slate-100 text-slate-400'
                                }`}
                            >
                              {sub}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-100">
                        <button
                          onClick={handleSaveChanges}
                          disabled={saving}
                          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex justify-center items-center gap-2"
                        >
                          {saving ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FiSave /> Save Profile Updates</>}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                      {/* Personal Info Box */}
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <FiInfo size={14} className="text-indigo-500" />
                          Personal Information
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-xs text-slate-500 font-bold">Father's Name</span>
                            <span className="text-sm font-black text-slate-800">{selectedStudent.fname}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5"><FiPhone size={12} /> Contact</span>
                            <span className="text-sm font-black text-slate-800">{selectedStudent.contact}</span>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5"><FiMapPin size={12} /> Address</span>
                            <p className="text-sm font-black text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl">{selectedStudent.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Academic Info Box */}
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <FiBookOpen size={14} className="text-emerald-500" />
                          Academic Status
                        </h4>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-xs text-slate-500 font-bold">Academic Group</span>
                            <span className="text-sm font-black text-slate-800">{selectedStudent.group}</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                            <span className="text-xs text-slate-500 font-bold">Current Grade</span>
                            <span className="text-sm font-black text-slate-800">{selectedStudent.classLevel} Level</span>
                          </div>
                          <div className="space-y-2">
                            <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5"><FiFilter size={12} /> Enrolled Subjects</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedStudent.subjects?.map(sub => (
                                <span key={sub} className="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase">
                                  {sub}
                                </span>
                              ))}
                              {(!selectedStudent.subjects || selectedStudent.subjects.length === 0) && (
                                <span className="text-xs text-slate-400 italic">No subjects assigned.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Footer */}
                <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <FiActivity className="text-indigo-500" />
                    <span>Last Updated: {new Date(selectedStudent.updatedAt || selectedStudent.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span>Student ID: {selectedStudent._id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default EditStudentInfo

