import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { studentAPI } from '../services/api'
import toast from 'react-hot-toast'

function AddStudent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    fname: '',
    address: '',
    contact: '',
    classLevel: '',
    group: ''
  })

  // Available subjects for selection
  const subjectOptions = [
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Urdu",
    "Tarjama",
    "Computer Science",
    "Economics",
    "Physical Education"
  ]

  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubjectChange = (e) => {
    const { value, checked } = e.target
    if (checked) {
      setSelectedSubjects([...selectedSubjects, value])
    } else {
      setSelectedSubjects(selectedSubjects.filter(sub => sub !== value))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.rollNo.trim()) newErrors.rollNo = 'Roll No is required'
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.fname.trim()) newErrors.fname = 'Father Name is required'
    if (!formData.contact) newErrors.contact = 'Contact is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.classLevel) newErrors.classLevel = 'Class Level is required'
    if (!formData.group) newErrors.group = 'Group is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    // Ensure strictly valid payload
    const payload = {
      ...formData,
      contact: Number(formData.contact), // Ensure number
      subjects: selectedSubjects
    }

    try {
      const response = await studentAPI.createStudent(payload)
      if (response.data && response.data.success) {
        toast.success('Student added successfully')
        setFormData({
          rollNo: '',
          name: '',
          fname: '',
          address: '',
          contact: '',
          classLevel: '',
          group: ''
        })
        setSelectedSubjects([])
        // Optional: Navigate back or stay to add more
        // navigate('/admin/dashboard') 
      } else {
        toast.error(response.data?.error || 'Failed to register student')
      }
    } catch (error) {
      console.error("Submission Error:", error);
      const errMsg = error.response?.data?.error || error.message || 'Failed to add student';
      toast.error(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-govt-gray-light py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center text-govt-primary hover:text-govt-secondary font-semibold transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Admin Dashboard
            </Link>
          </div>

          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl shadow-lg inline-block mb-6">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Register New Student</h1>
            <p className="text-gray-600">Add a new student record to the system</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="rollNo" className="block text-sm font-semibold text-gray-700 mb-2">
                    Roll No *
                  </label>
                  <input
                    id="rollNo"
                    name="rollNo"
                    type="text"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.rollNo ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="e.g. 11-FSC-001"
                  />
                  {errors.rollNo && <p className="mt-1 text-sm text-red-600">{errors.rollNo}</p>}
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter student name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="fname" className="block text-sm font-semibold text-gray-700 mb-2">
                    Father Name *
                  </label>
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    value={formData.fname}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.fname ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter father name"
                  />
                  {errors.fname && <p className="mt-1 text-sm text-red-600">{errors.fname}</p>}
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    id="contact"
                    name="contact"
                    type="number"
                    value={formData.contact}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.contact ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="03001234567"
                  />
                  {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="classLevel" className="block text-sm font-semibold text-gray-700 mb-2">
                    Class Level *
                  </label>
                  <select
                    id="classLevel"
                    name="classLevel"
                    value={formData.classLevel}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.classLevel ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  >
                    <option value="">Select Level</option>
                    <option value="11th">11th</option>
                    <option value="12th">12th</option>
                  </select>
                  {errors.classLevel && <p className="mt-1 text-sm text-red-600">{errors.classLevel}</p>}
                </div>

                <div>
                  <label htmlFor="group" className="block text-sm font-semibold text-gray-700 mb-2">
                    Group *
                  </label>
                  <select
                    id="group"
                    name="group"
                    value={formData.group}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.group ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  >
                    <option value="">Select Group</option>
                    <option value="Pre-Medical">Pre-Medical</option>
                    <option value="Pre-Engineering">Pre-Engineering</option>
                    <option value="ICS">ICS</option>
                    <option value="FA">FA</option>
                    <option value="ICom">ICom</option>
                  </select>
                  {errors.group && <p className="mt-1 text-sm text-red-600">{errors.group}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Subjects
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50">
                    {subjectOptions.map(subject => (
                      <label key={subject} className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          value={subject}
                          checked={selectedSubjects.includes(subject)}
                          onChange={handleSubjectChange}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-display font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering Student...
                  </div>
                ) : (
                  'Register Student'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddStudent
