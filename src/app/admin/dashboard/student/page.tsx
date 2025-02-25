"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
	MoreVertical,
	Filter,
	Download,
	X,
	ChevronDown,
	Search,
  EyeOff,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, push, set, onValue, remove, update, DataSnapshot } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { database, auth } from "../../../lib/firebaseConfig";

interface Student {
	id?: string;
	name: string;
	studentId: string;
	level: string;
	yearOfStudy: string;
	dateCreated: string;
	timeCreated: string;
	email: string;
	phone: string;
	dues?: {
		level: string;
		status: "PAID" | "UNPAID";
	}[];
}

export default function StudentDatabase() {
	const [activeLevel, setActiveLevel] = useState("All");
	const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
	const [showViewModal, setShowViewModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
	const [showAddStudentModal, setShowAddStudentModal] = useState(false);
	const [newStudent, setNewStudent] = useState({
		name: "",
		regNumber: "",
		yearOfStudy: "2020/2024",
		email: "",
		phone: "",
		password: "",
	});
	const [showDues, setShowDues] = useState(false);
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCriteria, setFilterCriteria] = useState({
		level: "All",
		yearOfStudy: "All",
	});

	const levels = ["All", "100 lvl", "200 lvl", "300 lvl", "400 lvl"];
	const yearOptions = [
		"All",
		"2020/2024",
		"2021/2025",
		"2022/2026",
		"2023/2027",
	];
	const [showPassword, setShowPassword] = useState(false);

	// Fetch students from Firebase
	useEffect(() => {
		const studentsRef = ref(database, "students");

		const unsubscribe = onValue(
			studentsRef,
			(snapshot) => {
				setLoading(true);
				const data = snapshot.val();

				if (data) {
					const studentsArray = Object.entries(data).map(
						([id, value]: [string, any]) => ({
							id,
							...value,
						})
					);
					setStudents(studentsArray);
				} else {
					setStudents([]);
				}
				setLoading(false);
			},
			(error) => {
				console.error("Error fetching students:", error);
				setError("Failed to load students. Please try again later.");
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, []);

	// Filter students based on active level, search term, and filter criteria
	const filteredStudents = students.filter((student) => {
		// Filter by level
		if (activeLevel !== "All" && student.level !== activeLevel) {
			return false;
		}

		// Filter by search term
		if (
			searchTerm &&
			!student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			!student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) &&
			!student.email.toLowerCase().includes(searchTerm.toLowerCase())
		) {
			return false;
		}

		// Filter by additional criteria
		if (
			filterCriteria.yearOfStudy !== "All" &&
			student.yearOfStudy !== filterCriteria.yearOfStudy
		) {
			return false;
		}

		return true;
	});

	const handleAction = (
		action: "view" | "edit" | "delete",
		student: Student
	) => {
		setSelectedStudent(student);
		setActiveDropdown(null);

		switch (action) {
			case "view":
				setShowViewModal(true);
				break;
			case "edit":
				setShowEditModal(true);
				break;
			case "delete":
				setShowDeleteModal(true);
				break;
		}
	};

	const slideIn = {
		initial: { x: "100%" },
		animate: { x: 0 },
		exit: { x: "100%" },
		transition: { type: "spring", damping: 30, stiffness: 300 },
	};

	const backdrop = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.2 },
	};

	const dropdown = {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
		transition: { duration: 0.1 },
	};

	const checkEmailExists = async (email: string) => {
		try {
			// Query the database to check if the email already exists
			const studentsRef = ref(database, "students");
			const snapshot = await new Promise<DataSnapshot>((resolve) => {
				onValue(studentsRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
			});

			const data = snapshot.val();
			if (data) {
				const students = Object.values(data) as any[];
				return students.some((student) => student.email === email);
			}
			return false;
		} catch (error) {
			console.error("Error checking email:", error);
			return false;
		}
	};

	const handleAddStudent = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validate password
		if (newStudent.password.length < 6) {
			setError("Password must be at least 6 characters long");
			return;
		}

		try {
			// Check if email already exists in the database
			const emailExists = await checkEmailExists(newStudent.email);
			if (emailExists) {
				setError(
					"This email is already registered in our database. Please use a different email address."
				);
				return;
			}

			// Create user with email and password
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				newStudent.email,
				newStudent.password
			);
			const user = userCredential.user;

			// Generate student data
			const studentData = {
				name:
					newStudent.name ||
					newStudent.regNumber.split("/")[1] ||
					newStudent.regNumber, // Use provided name or fallback
				studentId: newStudent.regNumber,
				level: "100 lvl", // Default level for new students
				yearOfStudy: newStudent.yearOfStudy,
				dateCreated: new Date().toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				}),
				timeCreated: new Date().toLocaleTimeString("en-US", {
					hour: "numeric",
					minute: "2-digit",
					hour12: true,
				}),
				email: newStudent.email,
				phone: newStudent.phone,
				uid: user.uid,
				dues: [{ level: "100 lvl", status: "UNPAID" }],
			};

			// Add to Realtime Database
			const studentsRef = ref(database, "students");
			const newStudentRef = push(studentsRef);
			await set(newStudentRef, studentData);

			// Reset form and close modal
			setNewStudent({
				name: "",
				regNumber: "",
				yearOfStudy: "2020/2024",
				email: "",
				phone: "",
				password: "",
			});
			setShowAddStudentModal(false);
		} catch (error: any) {
			console.error("Error adding student:", error);

			// Handle specific Firebase auth errors
			if (error.code === "auth/weak-password") {
				setError("Password is too weak. Please use at least 6 characters.");
			} else if (error.code === "auth/email-already-in-use") {
				setError(
					"This email is already registered. Please use a different email address or try logging in instead."
				);
			} else if (error.code === "auth/invalid-email") {
				setError("Invalid email address. Please check and try again.");
			} else {
				setError("Failed to add student. Please try again.");
			}
		}
	};

	const handleEditStudent = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedStudent || !selectedStudent.id) return;

		try {
			// Get form data from the event
			const formData = new FormData(e.target as HTMLFormElement);
			const updatedData = {
				name: formData.get("name") as string,
				studentId: formData.get("regNumber") as string,
				yearOfStudy: formData.get("yearOfStudy") as string,
				email: formData.get("email") as string,
				phone: formData.get("phone") as string,
			};

			// Update in Firebase
			const studentRef = ref(database, `students/${selectedStudent.id}`);
			await update(studentRef, updatedData);

			setShowEditModal(false);
		} catch (error) {
			console.error("Error updating student:", error);
			setError("Failed to update student. Please try again.");
		}
	};

	const handleDeleteStudent = async () => {
		if (!selectedStudent || !selectedStudent.id) return;

		try {
			const studentRef = ref(database, `students/${selectedStudent.id}`);
			await remove(studentRef);
			setShowDeleteModal(false);
		} catch (error) {
			console.error("Error deleting student:", error);
			setError("Failed to delete student. Please try again.");
		}
	};

	const exportToCSV = () => {
		// Define CSV headers
		const headers = [
			"Name",
			"Student ID",
			"Level",
			"Year of Study",
			"Email",
			"Phone",
			"Date Created",
			"Time Created",
		];

		// Convert student data to CSV rows
		const csvRows = [
			headers.join(","), // Header row
			...filteredStudents.map((student) =>
				[
					`"${student.name}"`,
					`"${student.studentId}"`,
					`"${student.level}"`,
					`"${student.yearOfStudy}"`,
					`"${student.email}"`,
					`"${student.phone}"`,
					`"${student.dateCreated}"`,
					`"${student.timeCreated}"`,
				].join(",")
			),
		];

		// Combine rows into a single CSV string
		const csvString = csvRows.join("\n");

		// Create a Blob and download link
		const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`students_${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="hidden md:block text-2xl font-semibold">
					Student Database
				</h1>
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

			{/* Search and Filter Bar */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<div className="relative flex-grow">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search by name, ID, or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
					{error}
				</div>
			)}

			{/* Table Section */}
			<div className="bg-white rounded-lg shadow">
				{/* Table Header */}
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="font-semibold">All Students</h2>
					<div className="flex items-center gap-4">
						<button
							className="flex items-center gap-2 text-gray-500 text-sm"
							onClick={() => setShowFilterModal(true)}
						>
							<Filter className="h-4 w-4" />
							Filter
						</button>
						<button
							className="flex items-center gap-2 text-gray-500 text-sm"
							onClick={exportToCSV}
						>
							<Download className="h-4 w-4" />
							Export CSV
						</button>
					</div>
				</div>

				{/* Loading State */}
				{loading && (
					<div className="p-8 text-center">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
						<p className="mt-2 text-gray-500">Loading students...</p>
					</div>
				)}

				{/* Empty State */}
				{!loading && filteredStudents.length === 0 && (
					<div className="p-8 text-center">
						<p className="text-gray-500">
							No students found. Add a new student to get started.
						</p>
					</div>
				)}

				{/* Table */}
				{!loading && filteredStudents.length > 0 && (
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
								{filteredStudents.map((student, i) => (
									<tr key={student.id} className="text-sm">
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
													title="Open actions menu"
													onClick={() =>
														setActiveDropdown(activeDropdown === i ? null : i)
													}
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
																	onClick={() =>
																		handleAction("delete", student)
																	}
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
				)}
			</div>

			<AnimatePresence>
				{/* Add New Student Modal */}
				{showAddStudentModal &&
					(() => {
						// Using an IIFE here to allow local hooks for toggling the password visibility.
						return (
							<motion.div
								className="fixed inset-0 z-50 overflow-y-auto"
								initial="initial"
								animate="animate"
								exit="exit"
							>
								<motion.div
									className="absolute inset-0 bg-black bg-opacity-50 "
									variants={backdrop}
									onClick={() => setShowAddStudentModal(false)}
								/>
								<motion.div
									className="absolute right-0 top-0 bg-white w-[400px] min-h-screen overflow-y-auto"
									variants={slideIn}
								>
									<form onSubmit={handleAddStudent} className="p-6">
										<div className="flex justify-between items-center mb-4">
											<h2 className="text-lg font-medium">ADD NEW STUDENT</h2>
											<button
												type="button"
												onClick={() => setShowAddStudentModal(false)}
											>
												<X className="h-5 w-5 text-gray-400" />
											</button>
										</div>

										<div className="space-y-4">
											<div>
												<label className="block text-sm mb-2">
													Enter Student Name
												</label>
												<input
													type="text"
													value={newStudent.name}
													onChange={(e) =>
														setNewStudent({
															...newStudent,
															name: e.target.value,
														})
													}
													placeholder="Enter Student Name"
													className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													required
												/>
											</div>

											<div>
												<label className="block text-sm mb-2">
													Enter Reg. Number
												</label>
												<input
													type="text"
													value={newStudent.regNumber}
													onChange={(e) =>
														setNewStudent({
															...newStudent,
															regNumber: e.target.value,
														})
													}
													placeholder="Enter Reg. Number"
													title="Enter Reg. Number"
													className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													required
												/>
											</div>

											<div>
												<label className="block text-sm mb-2">
													Select Year Of Study
												</label>
												<div className="relative">
													<select
														title="Select Year of Study"
														value={newStudent.yearOfStudy}
														onChange={(e) =>
															setNewStudent({
																...newStudent,
																yearOfStudy: e.target.value,
															})
														}
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
												<label className="block text-sm mb-2">
													Enter Email Address
												</label>
												<input
													type="email"
													value={newStudent.email}
													onChange={(e) =>
														setNewStudent({
															...newStudent,
															email: e.target.value,
														})
													}
													className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													required
												/>
											</div>

											<div>
												<label className="block text-sm mb-2">
													Enter Phone Number
												</label>
												<input
													type="tel"
													value={newStudent.phone}
													onChange={(e) =>
														setNewStudent({
															...newStudent,
															phone: e.target.value,
														})
													}
													className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													required
												/>
											</div>

											<div className="relative">
												<label className="block text-sm mb-2">
													Create Password
												</label>
												<input
													type={showPassword ? "text" : "password"}
													title="Create Password"
													placeholder="Enter a secure password"
													value={newStudent.password}
													onChange={(e) =>
														setNewStudent({
															...newStudent,
															password: e.target.value,
														})
													}
													className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
													required
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute inset-y-0 right-0 pr-3 flex items-center"
												>
													{showPassword ? (
														<EyeOff className="h-5 w-5 text-gray-400" />
													) : (
														<Eye className="h-5 w-5 text-gray-400" />
													)}
												</button>
												<p className="text-xs text-gray-500 mt-1">
													Password must be at least 6 characters long
												</p>
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
						);
					})()}

				{/* Filter Modal */}
				{showFilterModal && (
					<motion.div
						className="fixed inset-0 z-50"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowFilterModal(false)}
						/>
						<motion.div
							className="absolute right-0 top-0 bg-white w-[400px] min-h-screen"
							variants={slideIn}
						>
							<div className="p-6">
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-lg font-medium">FILTER STUDENTS</h2>
									<button onClick={() => setShowFilterModal(false)}>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm mb-2">Level</label>
										<div className="relative">
											<select
												value={filterCriteria.level}
												onChange={(e) =>
													setFilterCriteria({
														...filterCriteria,
														level: e.target.value,
													})
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
											>
												{levels.map((level) => (
													<option key={level} value={level}>
														{level}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
										</div>
									</div>

									<div>
										<label className="block text-sm mb-2">Year of Study</label>
										<div className="relative">
											<select
												value={filterCriteria.yearOfStudy}
												onChange={(e) =>
													setFilterCriteria({
														...filterCriteria,
														yearOfStudy: e.target.value,
													})
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
											>
												{yearOptions.map((year) => (
													<option key={year} value={year}>
														{year}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
										</div>
									</div>
								</div>

								<div className="flex justify-end gap-3 mt-8">
									<button
										className="px-6 py-2.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
										onClick={() => {
											setFilterCriteria({
												level: "All",
												yearOfStudy: "All",
											});
										}}
									>
										Reset
									</button>
									<button
										className="px-6 py-2.5 text-sm bg-[#003F87] text-white rounded-md hover:bg-[#002F65] transition-colors"
										onClick={() => {
											setActiveLevel(filterCriteria.level);
											setShowFilterModal(false);
										}}
									>
										Apply Filters
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}

				{/* View Modal */}
				{showViewModal && selectedStudent && (
					<motion.div
						className="fixed inset-0 z-50"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowViewModal(false)}
						/>
						<motion.div
							className="absolute right-0 top-0 bg-white w-[400px] min-h-screen"
							variants={slideIn}
						>
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
										<button
											onClick={() => setShowDues(!showDues)}
											className="flex items-center justify-between w-full"
										>
											<span className="text-sm text-gray-500">
												Total Dues Paid
											</span>
											<ChevronDown
												className={`h-5 w-5 text-gray-400 transform transition-transform ${
													showDues ? "rotate-180" : ""
												}`}
											/>
										</button>

										{showDues && (
											<div className="mt-4 space-y-4">
												{selectedStudent.dues?.map((due) => (
													<div
														key={due.level}
														className="flex justify-between items-center"
													>
														<span className="text-sm">{due.level}</span>
														<span
															className={`text-sm ${
																due.status === "PAID"
																	? "text-green-500"
																	: "text-red-500"
															}`}
														>
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
					<motion.div
						className="fixed inset-0 z-50"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowEditModal(false)}
						/>
						<motion.div
							className="absolute right-0 top-0 bg-white w-[400px] min-h-screen"
							variants={slideIn}
						>
							<form onSubmit={handleEditStudent} className="p-6">
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-lg font-medium">EDIT STUDENT DETAILS</h2>
									<button type="button" onClick={() => setShowEditModal(false)}>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm mb-2" htmlFor="name">
											Student Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											defaultValue={selectedStudent.name}
											className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="block text-sm mb-2" htmlFor="regNumber">
											Enter Reg. Number
										</label>
										<input
											type="text"
											id="regNumber"
											name="regNumber"
											defaultValue={selectedStudent.studentId}
											className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="block text-sm mb-2" htmlFor="yearOfStudy">
											Select Year Of Study
										</label>
										<div className="relative">
											<select
												id="yearOfStudy"
												name="yearOfStudy"
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
										<label className="block text-sm mb-2" htmlFor="email">
											Enter Email Address
										</label>
										<input
											type="email"
											id="email"
											name="email"
											defaultValue={selectedStudent.email}
											className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="block text-sm mb-2" htmlFor="phone">
											Enter Phone Number
										</label>
										<input
											type="tel"
											id="phone"
											name="phone"
											defaultValue={selectedStudent.phone}
											className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div>
										<label className="block text-sm mb-2" htmlFor="password">
											Create Password
										</label>
										<input
											type="password"
											id="password"
											name="password"
											className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="••••••••••••••••"
										/>
										<p className="text-xs text-gray-500 mt-1">
											Leave blank to keep current password
										</p>
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
					<motion.div
						className="fixed inset-0 z-50"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowDeleteModal(false)}
						/>
						<motion.div
							className="absolute right-0 top-0 bg-white w-[400px] min-h-screen"
							variants={slideIn}
						>
							<div className="p-6">
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-lg font-medium">DELETE STUDENT</h2>
									<button onClick={() => setShowDeleteModal(false)}>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-4">
									<p className="text-gray-600">
										Are you sure you want to delete this student? This action
										cannot be undone.
									</p>

									<div className="bg-gray-50 rounded-lg p-4 space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-500">
												Student Name
											</span>
											<span className="font-medium">
												{selectedStudent.name}
											</span>
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
										<button
											className="px-6 py-2.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
											onClick={handleDeleteStudent}
										>
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
	);
}
