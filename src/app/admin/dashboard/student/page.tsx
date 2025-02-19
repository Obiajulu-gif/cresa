"use client"

import type React from "react"

import { useState } from "react"
import { MoreVertical, Filter, Download, X, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Student {
  name: string
  studentId: string
  level: string
  yearOfStudy: string
  dateCreated: string
  timeCreated: string
  email: string
  phone: string
  dues?: {
    level: string
    status: "PAID" | "UNPAID"
  }[]
}

export default function StudentDatabase() {
  const [activeLevel, setActiveLevel] = useState("All")
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showAddStudentModal, setShowAddStudentModal] = useState(false)
  const [newStudent, setNewStudent] = useState({
    regNumber: "",
    yearOfStudy: "2020/2024",
    email: "",
    phone: "",
    password: "",
  })
  const [showDues, setShowDues] = useState(false)

  const levels = ["All", "100 lvl", "200 lvl", "300 lvl", "400 lvl"]

  const students: Student[] = [
    {
      name: "Emulo David",
      studentId: "2020/248279",
      level: "400 lvl",
      yearOfStudy: "2020/2024",
      dateCreated: "Apr 12, 2023",
      timeCreated: "09:32AM",
      email: "emulodavid@gmail.com",
      phone: "+234 9031824914",
      dues: [
        { level: "100 lvl", status: "PAID" },
        { level: "200 lvl", status: "PAID" },
        { level: "300 lvl", status: "UNPAID" },
        { level: "400 lvl", status: "UNPAID" },
      ],
    },
    {
      name: "Jessica Ibeh",
      studentId: "2020/247875",
      level: "300 lvl",
      yearOfStudy: "2020/2024",
      dateCreated: "Apr 12, 2023",
      timeCreated: "09:32AM",
      email: "jessicaibeh@gmail.com",
      phone: "+234 8031824914",
      dues: [
        { level: "100 lvl", status: "PAID" },
        { level: "200 lvl", status: "PAID" },
        { level: "300 lvl", status: "UNPAID" },
      ],
    },
    {
      name: "John Alex",
      studentId: "2020/257868",
      level: "300 lvl",
      yearOfStudy: "2020/2024",
      dateCreated: "Apr 12, 2023",
      timeCreated: "09:32AM",
      email: "johnalex@gmail.com",
      phone: "+234 7031824914",
      dues: [
        { level: "100 lvl", status: "PAID" },
        { level: "200 lvl", status: "PAID" },
        { level: "300 lvl", status: "PAID" },
      ],
    },
    {
      name: "Albert Hilda",
      studentId: "2020/247875",
      level: "200 lvl",
      yearOfStudy: "2020/2024",
      dateCreated: "Apr 12, 2023",
      timeCreated: "09:32AM",
      email: "alberthilda@gmail.com",
      phone: "+234 9131824914",
      dues: [
        { level: "100 lvl", status: "PAID" },
        { level: "200 lvl", status: "PAID" },
      ],
    },
    {
      name: "Mattew Nwabah",
      studentId: "2020/247875",
      level: "100 lvl",
      yearOfStudy: "2020/2024",
      dateCreated: "Apr 12, 2023",
      timeCreated: "09:32AM",
      email: "mattewnwabah@gmail.com",
      phone: "+234 8131824914",
      dues: [{ level: "100 lvl", status: "PAID" }],
    },
  ]

  const handleAction = (action: "view" | "edit" | "delete", student: Student) => {
    setSelectedStudent(student)
    setActiveDropdown(null)

    switch (action) {
      case "view":
        setShowViewModal(true)
        break
      case "edit":
        setShowEditModal(true)
        break
      case "delete":
        setShowDeleteModal(true)
        break
    }
  }

  const slideIn = {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    transition: { type: "spring", damping: 30, stiffness: 300 },
  }

  const backdrop = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  }

  const dropdown = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.1 },
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("New student:", newStudent)
    setShowAddStudentModal(false)
  }

  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Edit student:", selectedStudent)
    setShowEditModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="hidden md:block text-2xl font-semibold">Student Database</h1>
        <button
          className="bg-[#003F87] text-white px-4 py-2 rounded-md hover:bg-[#002F65] transition"
          onClick={() => setShowAddStudentModal(true)}
        >
          Add New Student
        </button>
      </div>

      {/* Level Filters */}
      <div className="flex gap-2 mb-6">
        {levels.map((level) => (
          <button
            key={level}
            className={`px-4 py-2 rounded-md ${
              activeLevel === level
                ? level === "All"
                  ? "bg-orange-50 text-orange-500"
                  : "bg-blue-50 text-blue-600"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => setActiveLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        {/* Table Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">All Students</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-500 text-sm">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 text-gray-500 text-sm">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-sm text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Student Name</th>
                <th className="px-6 py-3 text-left">Student ID</th>
                <th className="px-6 py-3 text-left">Level</th>
                <th className="px-6 py-3 text-left">Year of Study</th>
                <th className="px-6 py-3 text-left">Date Created</th>
                <th className="px-6 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student, i) => (
                <tr key={i} className="text-sm">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.studentId}</td>
                  <td className="px-6 py-4">{student.level}</td>
                  <td className="px-6 py-4">{student.yearOfStudy}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.dateCreated} · {student.timeCreated}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === i ? null : i)}
                        className="p-1 hover:bg-gray-100 rounded-full"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === i && (
                          <motion.div
                            className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10"
                            variants={dropdown}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleAction("view", student)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleAction("edit", student)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleAction("delete", student)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* Add New Student Modal */}
        {showAddStudentModal && (
          <motion.div className="fixed inset-0 z-50" initial="initial" animate="animate" exit="exit">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              variants={backdrop}
              onClick={() => setShowAddStudentModal(false)}
            />
            <motion.div className="absolute right-0 top-0 bg-white w-[400px] min-h-screen" variants={slideIn}>
              <form onSubmit={handleAddStudent} className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-medium">ADD NEW STUDENT</h2>
                  <button type="button" onClick={() => setShowAddStudentModal(false)}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Enter Reg. Number</label>
                    <input
                      type="text"
                      value={newStudent.regNumber}
                      onChange={(e) => setNewStudent({ ...newStudent, regNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Select Year Of Study</label>
                    <div className="relative">
                      <select
                        value={newStudent.yearOfStudy}
                        onChange={(e) => setNewStudent({ ...newStudent, yearOfStudy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option>2020/2024</option>
                        <option>2021/2025</option>
                        <option>2022/2026</option>
                        <option>2023/2027</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Enter Email Address</label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Enter Phone Number</label>
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Create Password</label>
                    <input
                      type="password"
                      value={newStudent.password}
                      onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    className="px-6 py-2.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    onClick={() => setShowAddStudentModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm bg-[#003F87] text-white rounded-md hover:bg-[#002F65] transition-colors"
                  >
                    Proceed
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* View Modal */}
        {showViewModal && selectedStudent && (
          <motion.div className="fixed inset-0 z-50" initial="initial" animate="animate" exit="exit">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              variants={backdrop}
              onClick={() => setShowViewModal(false)}
            />
            <motion.div className="absolute right-0 top-0 bg-white w-[400px] min-h-screen" variants={slideIn}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-medium">STUDENT DETAILS</h2>
                  <button onClick={() => setShowViewModal(false)}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Name</span>
                    <span>{selectedStudent.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Reg NO.</span>
                    <span>{selectedStudent.studentId}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Email Address</span>
                    <span>{selectedStudent.email}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Phone Number</span>
                    <span>{selectedStudent.phone}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Level</span>
                    <span>{selectedStudent.level}</span>
                  </div>

                  <div className="border-t pt-6">
                    <button onClick={() => setShowDues(!showDues)} className="flex items-center justify-between w-full">
                      <span className="text-sm text-gray-500">Total Dues Paid</span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transform transition-transform ${
                          showDues ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {showDues && (
                      <div className="mt-4 space-y-4">
                        {selectedStudent.dues?.map((due) => (
                          <div key={due.level} className="flex justify-between items-center">
                            <span className="text-sm">{due.level}</span>
                            <span className={`text-sm ${due.status === "PAID" ? "text-green-500" : "text-red-500"}`}>
                              {due.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedStudent && (
          <motion.div className="fixed inset-0 z-50" initial="initial" animate="animate" exit="exit">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              variants={backdrop}
              onClick={() => setShowEditModal(false)}
            />
            <motion.div className="absolute right-0 top-0 bg-white w-[400px] min-h-screen" variants={slideIn}>
              <form onSubmit={handleEditStudent} className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-medium">EDIT STUDENT DETAILS</h2>
                  <button type="button" onClick={() => setShowEditModal(false)}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2">Enter Reg. Number</label>
                    <input
                      type="text"
                      defaultValue={selectedStudent.studentId}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Select Year Of Study</label>
                    <div className="relative">
                      <select
                        defaultValue={selectedStudent.yearOfStudy}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      >
                        <option>2020/2024</option>
                        <option>2021/2025</option>
                        <option>2022/2026</option>
                        <option>2023/2027</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Enter Email Address</label>
                    <input
                      type="email"
                      defaultValue={selectedStudent.email}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Enter Phone Number</label>
                    <input
                      type="tel"
                      defaultValue={selectedStudent.phone}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Create Password</label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••••••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    className="px-6 py-2.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm bg-[#003F87] text-white rounded-md hover:bg-[#002F65] transition-colors"
                  >
                    Proceed
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedStudent && (
          <motion.div className="fixed inset-0 z-50" initial="initial" animate="animate" exit="exit">
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-50"
              variants={backdrop}
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div className="absolute right-0 top-0 bg-white w-[400px] min-h-screen" variants={slideIn}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-medium">DELETE STUDENT</h2>
                  <button onClick={() => setShowDeleteModal(false)}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600">
                    Are you sure you want to delete this student? This action cannot be undone.
                  </p>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Student Name</span>
                      <span className="font-medium">{selectedStudent.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Student ID</span>
                      <span>{selectedStudent.studentId}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8">
                    <button
                      className="px-6 py-2.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button className="px-6 py-2.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                      Delete Student
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

