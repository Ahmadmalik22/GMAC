import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

function RegisterTeacher() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    subjects: [],
    qualification: '',
    experience: '',
    joinDate: '',
    password: '' // Default password for teacher
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const availableSubjects = [
    // Compulsory subjects for all groups
    'English', 'Urdu', 'Tarjama',
    // Year-specific subjects
    'Pakistan Studies', 'Islamic Studies',
    // Science subjects
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Computer Science',
    // Elective subjects
    'Economics', 'Civics', 'Physical Education', 'Education'
  ]


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }))
  }


  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^03\d{9}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Phone number must be in format 03XXXXXXXXX'
    }
    if (!formData.cnic.trim()) {
      newErrors.cnic = 'CNIC is required'
    } else if (!/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
      newErrors.cnic = 'CNIC must be in format XXXXX-XXXXXXX-X'
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (formData.subjects.length === 0) newErrors.subjects = 'At least one subject must be selected'
    if (!formData.qualification.trim()) newErrors.qualification = 'Qualification is required'
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required'
    if (!formData.joinDate) newErrors.joinDate = 'Join date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Prepare teacher data for API
      const teacherData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        cnic: formData.cnic,
        address: formData.address,
        subjects: formData.subjects,
        qualification: formData.qualification,
        experience: parseInt(formData.experience),
        joinDate: formData.joinDate,
        password: formData.password || 'teacher123' // Default password
      }

      const result = await adminAPI.registerTeacher(teacherData)

      if (result.data && result.data.success) {
        toast.success(`Teacher "${formData.firstName} ${formData.lastName}" registered successfully!`)

        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          cnic: '',
          address: '',
          subjects: [],
          qualification: '',
          experience: '',
          joinDate: '',
          password: ''
        })

        // Navigate back to admin dashboard after short delay
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 1500)
      }
    } catch (error) {
      console.error('Error registering teacher:', error)
      toast.error('Failed to register teacher. Please try again.')
    } finally {
      setIsLoading(false)
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
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg inline-block mb-6">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Register New Teacher</h1>
            <p className="text-gray-600">Add a new teacher to the intermediate college system</p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="teacher@college.edu.pk"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="03XXXXXXXXX"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="cnic" className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIC *
                  </label>
                  <input
                    id="cnic"
                    name="cnic"
                    type="text"
                    value={formData.cnic}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.cnic ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="XXXXX-XXXXXXX-X"
                  />
                  {errors.cnic && <p className="mt-1 text-sm text-red-600">{errors.cnic}</p>}
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
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Subjects to Teach *
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-3">
                    {availableSubjects.map(subject => (
                      <label key={subject} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.subjects.includes(subject)}
                          onChange={() => handleSubjectChange(subject)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{subject}</span>
                      </label>
                    ))}
                  </div>
                  {errors.subjects && <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>}
                </div>


                <div>
                  <label htmlFor="qualification" className="block text-sm font-semibold text-gray-700 mb-2">
                    Highest Qualification *
                  </label>
                  <select
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.qualification ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                  >
                    <option value="">Select qualification</option>
                    <option value="Bachelor">Bachelor's Degree</option>
                    <option value="Master">Master's Degree</option>
                    <option value="MPhil">MPhil</option>
                    <option value="PhD">PhD</option>
                    <option value="B.Ed">B.Ed</option>
                    <option value="M.Ed">M.Ed</option>
                  </select>
                  {errors.qualification && <p className="mt-1 text-sm text-red-600">{errors.qualification}</p>}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.experience ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                    placeholder="Years of teaching experience"
                  />
                  {errors.experience && <p className="mt-1 text-sm text-red-600">{errors.experience}</p>}
                </div>

                <div>
                  <label htmlFor="joinDate" className="block text-sm font-semibold text-gray-700 mb-2">
                    Join Date *
                  </label>
                  <input
                    id="joinDate"
                    name="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border ${errors.joinDate ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
                  />
                  {errors.joinDate && <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Default Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="text"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-gray-50"
                    placeholder="teacher123"
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">This will be the teacher's default password. They can change it later.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-display font-bold text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering Teacher...
                  </div>
                ) : (
                  'Register Teacher'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterTeacher
