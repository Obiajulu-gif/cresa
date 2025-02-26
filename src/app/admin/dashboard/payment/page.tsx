"use client";

import React from "react";

import { useState, useEffect, useRef } from "react";
import {
	Filter,
	MoreVertical,
	Download,
	X,
	Copy,
	ChevronDown,
	Share2,
	Mail,
	Printer,
	Link2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ref, onValue, push, set } from "firebase/database";
import { database } from "../../../lib/firebaseConfig";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Student {
	id?: string;
	name: string;
	studentId: string;
	level: string;
	yearOfStudy: string;
	email: string;
	phone: string;
}

interface Payment {
	id?: string;
	session: string;
	studentID: string;
	amount: string;
	type: string;
	level: string;
	date: string;
	time: string;
	status: string;
	transactionNo?: string;
	paymentType?: string;
	payeeName?: string;
	regNo?: string;
}

interface Due {
	id?: string;
	title: string;
	isRecurring: boolean;
	levelAmounts: {
		[key: string]: number;
	};
	dateCreated: string;
}

interface FilterOptions {
	type: string;
	level: string;
	status: string;
	session: string;
}

type SortField = "date" | "amount" | "studentID" | "type" | "level" | "status";
type SortDirection = "asc" | "desc";

export default function PaymentsPage() {
	const [activeTab, setActiveTab] = useState("all");
	const [showReceiptModal, setShowReceiptModal] = useState(false);
	const [showAddDueModal, setShowAddDueModal] = useState(false);
	const [showFilterModal, setShowFilterModal] = useState(false);
	const [showSortModal, setShowSortModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
	const [showLevelAmounts, setShowLevelAmounts] = useState(true);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingStudents, setLoadingStudents] = useState(true);
	const [error, setError] = useState("");
	const [shareUrl, setShareUrl] = useState("");
	const [shareLoading, setShareLoading] = useState(false);
	const receiptRef = useRef<HTMLDivElement>(null);

	// Filter and sort states
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({
		type: "All",
		level: "All",
		status: "All",
		session: "All",
	});
	const [sortConfig, setSortConfig] = useState<{
		field: SortField;
		direction: SortDirection;
	}>({
		field: "date",
		direction: "desc",
	});

	// New due form state
	const [newDue, setNewDue] = useState<{
		title: string;
		isRecurring: boolean;
		levelAmounts: {
			"100 lvl": string;
			"200 lvl": string;
			"300 lvl": string;
			"400 lvl": string;
		};
	}>({
		title: "",
		isRecurring: false,
		levelAmounts: {
			"100 lvl": "",
			"200 lvl": "",
			"300 lvl": "",
			"400 lvl": "",
		},
	});

	// Fetch students from Firebase
	useEffect(() => {
		const studentsRef = ref(database, "students");

		const unsubscribe = onValue(
			studentsRef,
			(snapshot) => {
				setLoadingStudents(true);
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
				setLoadingStudents(false);
			},
			(error) => {
				console.error("Error fetching students:", error);
				setLoadingStudents(false);
			}
		);

		return () => unsubscribe();
	}, []);

	// Fetch payments from Firebase
	useEffect(() => {
		const paymentsRef = ref(database, "payments");

		const unsubscribe = onValue(
			paymentsRef,
			(snapshot) => {
				setLoading(true);
				const data = snapshot.val();

				if (data) {
					const paymentsArray = Object.entries(data).map(
						([id, value]: [string, any]) => ({
							id,
							...value,
						})
					);
					setPayments(paymentsArray);
				} else {
					setPayments([]);
				}
				setLoading(false);
			},
			(error) => {
				console.error("Error fetching payments:", error);
				setError("Failed to load payments. Please try again later.");
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, []);

	const handleAddDue = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			// Validate form
			if (!newDue.title.trim()) {
				setError("Please enter a due title");
				return;
			}

			// Convert string amounts to numbers and validate
			const levelAmounts: { [key: string]: number } = {};
			let hasAmount = false;

			Object.entries(newDue.levelAmounts).forEach(([level, amountStr]) => {
				if (amountStr.trim()) {
					const amount = Number.parseFloat(amountStr.replace(/[^0-9.]/g, ""));
					if (!isNaN(amount) && amount > 0) {
						levelAmounts[level] = amount;
						hasAmount = true;
					}
				}
			});

			if (!hasAmount) {
				setError("Please enter at least one valid amount");
				return;
			}

			// Create due object
			const dueData: Due = {
				title: newDue.title,
				isRecurring: newDue.isRecurring,
				levelAmounts,
				dateCreated: new Date().toISOString(),
			};

			// Add to Firebase
			const duesRef = ref(database, "dues");
			const newDueRef = push(duesRef);
			await set(newDueRef, dueData);

			// Create payment records for each student based on their level
			const paymentsRef = ref(database, "payments");
			const currentSession = `${new Date().getFullYear()}/${
				new Date().getFullYear() + 1
			}`;
			const currentDate = new Date().toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
			const currentTime = new Date().toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});

			// Group students by level
			const studentsByLevel: { [key: string]: Student[] } = {};
			students.forEach((student) => {
				if (!studentsByLevel[student.level]) {
					studentsByLevel[student.level] = [];
				}
				studentsByLevel[student.level].push(student);
			});

			// Create payment records for each level and each student in that level
			for (const [level, amount] of Object.entries(levelAmounts)) {
				const studentsInLevel = studentsByLevel[level] || [];

				if (studentsInLevel.length > 0) {
					// Create payment records for each student in this level
					for (const student of studentsInLevel) {
						const paymentData: Payment = {
							session: currentSession,
							studentID: student.studentId,
							amount: amount.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							}),
							type: dueData.title,
							level,
							date: currentDate,
							time: currentTime,
							status: "Pending",
							paymentType: "Due Created",
							payeeName: student.name,
							regNo: student.studentId,
						};

						const newPaymentRef = push(paymentsRef);
						await set(newPaymentRef, paymentData);
					}
				} else {
					// If no students in this level, create a placeholder payment
					const paymentData: Payment = {
						session: currentSession,
						studentID: "N/A",
						amount: amount.toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						}),
						type: dueData.title,
						level,
						date: currentDate,
						time: currentTime,
						status: "Pending",
						paymentType: "Due Created",
					};

					const newPaymentRef = push(paymentsRef);
					await set(newPaymentRef, paymentData);
				}
			}

			// Reset form and close modal
			setNewDue({
				title: "",
				isRecurring: false,
				levelAmounts: {
					"100 lvl": "",
					"200 lvl": "",
					"300 lvl": "",
					"400 lvl": "",
				},
			});
			setShowAddDueModal(false);
			setError("");
		} catch (error) {
			console.error("Error adding due:", error);
			setError("Failed to add due. Please try again.");
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

	const copyToClipboard = (text: string) => {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				alert("Copied to clipboard!");
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
			});
	};

	// Apply filters to payments
	const applyFilters = (payments: Payment[]) => {
		return payments.filter((payment) => {
			// Filter by tab first
			if (activeTab === "dept" && payment.type !== "Dept. Dues") {
				return false;
			}

			// Then apply additional filters
			if (filterOptions.type !== "All" && payment.type !== filterOptions.type) {
				return false;
			}

			if (
				filterOptions.level !== "All" &&
				payment.level !== filterOptions.level
			) {
				return false;
			}

			if (
				filterOptions.status !== "All" &&
				payment.status !== filterOptions.status
			) {
				return false;
			}

			if (
				filterOptions.session !== "All" &&
				payment.session !== filterOptions.session
			) {
				return false;
			}

			return true;
		});
	};

	// Apply sorting to payments
	const applySorting = (payments: Payment[]) => {
		return [...payments].sort((a, b) => {
			let comparison = 0;

			switch (sortConfig.field) {
				case "date":
					// Convert date strings to Date objects for comparison
					const dateA = new Date(`${a.date} ${a.time}`);
					const dateB = new Date(`${b.date} ${b.time}`);
					comparison = dateA.getTime() - dateB.getTime();
					break;

				case "amount":
					// Remove commas and convert to numbers
					const amountA = Number.parseFloat(a.amount.replace(/,/g, ""));
					const amountB = Number.parseFloat(b.amount.replace(/,/g, ""));
					comparison = amountA - amountB;
					break;

				case "studentID":
					comparison = a.studentID.localeCompare(b.studentID);
					break;

				case "type":
					comparison = a.type.localeCompare(b.type);
					break;

				case "level":
					comparison = a.level.localeCompare(b.level);
					break;

				case "status":
					comparison = a.status.localeCompare(b.status);
					break;

				default:
					comparison = 0;
			}

			return sortConfig.direction === "asc" ? comparison : -comparison;
		});
	};

	// Get unique values for filter options
	const getUniqueValues = (field: keyof Payment) => {
		const values = new Set<string>(
			payments.map((payment) => payment[field] as string)
		);
		return ["All", ...Array.from(values)];
	};

	// Filter and sort payments
	const filteredPayments = applySorting(applyFilters(payments));

	// Export to CSV function
	const exportToCSV = () => {
		// Define CSV headers
		const headers = [
			"Academic Session",
			"Student ID",
			"Amount (NGN)",
			"Type",
			"Level",
			"Date",
			"Time",
			"Status",
			"Transaction No",
			"Payment Type",
			"Payee Name",
			"Reg No",
		];

		// Convert payment data to CSV rows
		const csvRows = [
			headers.join(","), // Header row
			...filteredPayments.map((payment) =>
				[
					`"${payment.session}"`,
					`"${payment.studentID}"`,
					`"${payment.amount}"`,
					`"${payment.type}"`,
					`"${payment.level}"`,
					`"${payment.date}"`,
					`"${payment.time}"`,
					`"${payment.status}"`,
					`"${payment.transactionNo || ""}"`,
					`"${payment.paymentType || ""}"`,
					`"${payment.payeeName || ""}"`,
					`"${payment.regNo || ""}"`,
				].join(",")
			),
		];

		// Combine rows into a single CSV string
		const csvString = csvRows.join("\n");
		const filename = `payments_${new Date().toISOString().split("T")[0]}.csv`;

		// Create a Blob and download link
		const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", filename);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Share receipt functions
	const generatePDF = async () => {
		if (!receiptRef.current || !selectedPayment) return;

		setShareLoading(true);
		try {
			const canvas = await html2canvas(receiptRef.current);
			const imgData = canvas.toDataURL("image/png");

			const pdf = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4",
			});

			const imgWidth = 210; // A4 width in mm
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
			pdf.save(`receipt_${selectedPayment.transactionNo || Date.now()}.pdf`);
		} catch (error) {
			console.error("Error generating PDF:", error);
			alert("Failed to generate PDF. Please try again.");
		} finally {
			setShareLoading(false);
		}
	};

	const shareViaEmail = () => {
		if (!selectedPayment) return;

		const subject = `Payment Receipt - ${selectedPayment.type}`;
		const body = `
      Payment Receipt Details:
      
      Amount: ${selectedPayment.amount}
      Type: ${selectedPayment.type}
      Date: ${selectedPayment.date}
      Status: ${selectedPayment.status}
      ${
				selectedPayment.transactionNo
					? `Transaction No: ${selectedPayment.transactionNo}`
					: ""
			}
      ${
				selectedPayment.payeeName
					? `Payee Name: ${selectedPayment.payeeName}`
					: ""
			}
      ${
				selectedPayment.regNo ? `Registration No: ${selectedPayment.regNo}` : ""
			}
    `;

		window.location.href = `mailto:?subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(body)}`;
	};

	const generateShareableLink = () => {
		if (!selectedPayment) return;

		// In a real app, this would generate a unique URL on the server
		// For this demo, we'll create a dummy URL with the payment ID
		const baseUrl = window.location.origin;
		const shareableUrl = `${baseUrl}/receipt/${
			selectedPayment.id || Date.now()
		}`;

		setShareUrl(shareableUrl);
	};

	const printReceipt = () => {
		if (!receiptRef.current) return;

		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			alert("Please allow pop-ups to print the receipt");
			return;
		}

		const receiptHTML = receiptRef.current.innerHTML;
		printWindow.document.write(`
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .receipt-container { max-width: 500px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #ccc; }
            .label { color: #666; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>Payment Receipt</h1>
            </div>
            ${receiptHTML}
            <div style="margin-top: 30px; text-align: center;">
              <button onclick="window.print()">Print</button>
            </div>
          </div>
        </body>
      </html>
    `);

		printWindow.document.close();
	};

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-semibold">Payments And Receipts</h1>
				<button
					className="bg-[#003F87] text-white px-4 py-2 rounded-md hover:bg-[#002F65] transition"
					onClick={() => setShowAddDueModal(true)}
				>
					Add New Dues
				</button>
			</div>

			{/* Tabs */}
			<div className="flex gap-2 mb-6">
				<button
					className={`px-4 py-2 rounded-md flex items-center gap-2 ${
						activeTab === "all"
							? "bg-orange-50 text-orange-500"
							: "bg-white hover:bg-gray-50"
					}`}
					onClick={() => setActiveTab("all")}
				>
					<div
						className={`w-2 h-2 rounded-full ${
							activeTab === "all" ? "bg-orange-500" : "bg-gray-400"
						}`}
					/>
					All Dues
				</button>
				<button
					className={`px-4 py-2 rounded-md flex items-center gap-2 ${
						activeTab === "dept"
							? "bg-orange-50 text-orange-500"
							: "bg-white hover:bg-gray-50"
					}`}
					onClick={() => setActiveTab("dept")}
				>
					<div
						className={`w-2 h-2 rounded-full ${
							activeTab === "dept" ? "bg-orange-500" : "bg-gray-400"
						}`}
					/>
					Departmental Dues
				</button>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
					{error}
				</div>
			)}

			{/* Table Section */}
			<div className="bg-white rounded-lg shadow">
				{/* Table Header Controls */}
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="font-semibold">All Dues</h2>
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
							onClick={() => setShowSortModal(true)}
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 16 16"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M2 4H14M4 8H12M6 12H10"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
								/>
							</svg>
							Sort
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
				{loading || loadingStudents ? (
					<div className="p-8 text-center">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
						<p className="mt-2 text-gray-500">Loading data...</p>
					</div>
				) : filteredPayments.length === 0 ? (
					<div className="p-8 text-center text-gray-500">No payments found</div>
				) : (
					/* Table */
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50 text-sm text-gray-500">
								<tr>
									<th className="px-6 py-3 text-left">Academic Session</th>
									<th className="px-6 py-3 text-left">Student ID</th>
									<th className="px-6 py-3 text-left">Amount (NGN)</th>
									<th className="px-6 py-3 text-left">Type</th>
									<th className="px-6 py-3 text-left">Level</th>
									<th className="px-6 py-3 text-left">Date Created</th>
									<th className="px-6 py-3 text-left">Status</th>
									<th className="px-6 py-3 text-left"></th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredPayments.map((payment) => (
									<tr key={payment.id} className="text-sm">
										<td className="px-6 py-4">{payment.session}</td>
										<td className="px-6 py-4">{payment.studentID}</td>
										<td className="px-6 py-4">{payment.amount}</td>
										<td className="px-6 py-4">{payment.type}</td>
										<td className="px-6 py-4">{payment.level}</td>
										<td className="px-6 py-4 whitespace-nowrap">
											{payment.date} · {payment.time}
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-2 py-1 rounded-full text-xs ${
													payment.status.toLowerCase() === "pending"
														? "bg-yellow-100 text-yellow-800"
														: payment.status.toLowerCase() === "failed"
														? "bg-red-100 text-red-800"
														: "bg-green-100 text-green-800"
												}`}
											>
												{payment.status}
											</span>
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center justify-end gap-4">
												<button
													className="text-blue-600 hover:text-blue-800"
													onClick={() => {
														setSelectedPayment(payment);
														setShowReceiptModal(true);
													}}
												>
													View
												</button>
												<button title="More options">
													<MoreVertical className="h-4 w-4 text-gray-400" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* Animated Modals */}
			<AnimatePresence>
				{/* Add Due Modal */}
				{showAddDueModal && (
					<motion.div
						className="fixed inset-0 z-50"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowAddDueModal(false)}
						/>
						<motion.div
							className="absolute right-0 top-0 bg-white w-[400px] min-h-screen"
							variants={slideIn}
						>
							<form onSubmit={handleAddDue} className="p-6">
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-lg font-medium">ADD NEW DUE</h2>
									<button
										type="button"
										onClick={() => setShowAddDueModal(false)}
										title="Close modal"
									>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm mb-2">
											Enter Due Title
										</label>
										<input
											type="text"
											value={newDue.title}
											onChange={(e) =>
												setNewDue({ ...newDue, title: e.target.value })
											}
											className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter title"
											required
										/>
									</div>

									<div>
										<label className="block text-sm mb-3">
											How often should this due be paid?
										</label>
										<div className="space-y-3">
											<label className="flex items-center gap-3">
												<div className="relative flex items-center">
													<input
														type="radio"
														name="frequency"
														checked={!newDue.isRecurring}
														onChange={() =>
															setNewDue({ ...newDue, isRecurring: false })
														}
														className="w-4 h-4 border-2 border-gray-300 rounded-full appearance-none checked:border-blue-600 checked:border-4 transition-all"
													/>
												</div>
												<span className="text-sm">
													One-Time Payment (This Year Only)
												</span>
											</label>
											<label className="flex items-center gap-3">
												<div className="relative flex items-center">
													<input
														type="radio"
														name="frequency"
														checked={newDue.isRecurring}
														onChange={() =>
															setNewDue({ ...newDue, isRecurring: true })
														}
														className="w-4 h-4 border-2 border-gray-300 rounded-full appearance-none checked:border-blue-600 checked:border-4 transition-all"
													/>
												</div>
												<span className="text-sm">
													Recurring Payment (Every Year)
												</span>
											</label>
										</div>
									</div>

									<div className="border border-gray-200 rounded-md">
										<button
											type="button"
											className="flex items-center justify-between w-full p-4"
											onClick={() => setShowLevelAmounts(!showLevelAmounts)}
										>
											<span className="text-sm">
												Choose An Amount For Each Academic Level
											</span>
											<ChevronDown
												className={`h-5 w-5 text-gray-400 transform transition-transform ${
													showLevelAmounts ? "rotate-180" : ""
												}`}
											/>
										</button>

										{showLevelAmounts && (
											<div className="p-4 border-t border-gray-200 space-y-4">
												{[100, 200, 300, 400].map((level) => (
													<div
														key={level}
														className="flex justify-between items-center"
													>
														<span className="text-sm text-gray-600">
															{level} lvl
														</span>
														<input
															type="text"
															placeholder="NGN 3000"
															value={
																newDue.levelAmounts[
																	`${level} lvl` as keyof typeof newDue.levelAmounts
																]
															}
															onChange={(e) =>
																setNewDue({
																	...newDue,
																	levelAmounts: {
																		...newDue.levelAmounts,
																		[`${level} lvl`]: e.target.value,
																	},
																})
															}
															className="w-40 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
														/>
													</div>
												))}
											</div>
										)}
									</div>
								</div>

								<div className="flex justify-end gap-3 mt-8">
									<button
										type="button"
										className="px-6 py-2.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
										onClick={() => setShowAddDueModal(false)}
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
									<h2 className="text-lg font-medium">FILTER PAYMENTS</h2>
									<button
										onClick={() => setShowFilterModal(false)}
										title="Close filter modal"
									>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm mb-2">Payment Type</label>
										<div className="relative">
											<select
												title="Payment Type"
												aria-label="Payment Type"
												value={filterOptions.type}
												onChange={(e) =>
													setFilterOptions({
														...filterOptions,
														type: e.target.value,
													})
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
											>
												{getUniqueValues("type").map((type) => (
													<option key={type} value={type}>
														{type}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
										</div>
									</div>

									<div>
										<label className="block text-sm mb-2">Level</label>
										<div className="relative">
											<select
												title="Select Level"
												value={filterOptions.level}
												onChange={(e) =>
													setFilterOptions({
														...filterOptions,
														level: e.target.value,
													})
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
											>
												{getUniqueValues("level").map((level) => (
													<option key={level} value={level}>
														{level}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
										</div>
									</div>

									<div>
										<label className="block text-sm mb-2">Status</label>
										<div className="relative">
											<select
												title="Select Status"
												value={filterOptions.status}
												onChange={(e) =>
													setFilterOptions({
														...filterOptions,
														status: e.target.value,
													})
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
											>
												{getUniqueValues("status").map((status) => (
													<option key={status} value={status}>
														{status}
													</option>
												))}
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
										</div>
									</div>

									<div>
										<label className="block text-sm mb-2">
											Academic Session
										</label>
										<div className="relative">
											<select
												title="Select Academic Session"
												value={filterOptions.session}
												onChange={(e) =>
													setFilterOptions({
														...filterOptions,
														session: e.target.value,
													})
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
											>
												{getUniqueValues("session").map((session) => (
													<option key={session} value={session}>
														{session}
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
											setFilterOptions({
												type: "All",
												level: "All",
												status: "All",
												session: "All",
											});
										}}
									>
										Reset
									</button>
									<button
										className="px-6 py-2.5 text-sm bg-[#003F87] text-white rounded-md hover:bg-[#002F65] transition-colors"
										onClick={() => setShowFilterModal(false)}
									>
										Apply Filters
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}

				{/* Sort Modal */}
				{showSortModal && (
					<motion.div
						className="fixed inset-0 z-50"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowSortModal(false)}
						/>
						<motion.div
							className="absolute right-0 top-0 bg-white w-[400px] min-h-screen"
							variants={slideIn}
						>
							<div className="p-6">
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-lg font-medium">SORT PAYMENTS</h2>
									<button
										onClick={() => setShowSortModal(false)}
										title="Close sort modal"
									>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-6">
									<div>
										<label className="block text-sm mb-2">Sort By</label>
										<div className="relative">
											<select
												title="Sort By"
												aria-label="Sort By"
												value={sortConfig.field}
												onChange={(e) =>
													setSortConfig({
														...sortConfig,
														field: e.target.value as SortField,
													})
												}
												className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
											>
												<option value="date">Date</option>
												<option value="amount">Amount</option>
												<option value="studentID">Student ID</option>
												<option value="type">Payment Type</option>
												<option value="level">Level</option>
												<option value="status">Status</option>
											</select>
											<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
										</div>
									</div>

									<div>
										<label className="block text-sm mb-2">Order</label>
										<div className="space-y-3">
											<label className="flex items-center gap-3">
												<div className="relative flex items-center">
													<input
														type="radio"
														name="sortDirection"
														checked={sortConfig.direction === "asc"}
														onChange={() =>
															setSortConfig({ ...sortConfig, direction: "asc" })
														}
														className="w-4 h-4 border-2 border-gray-300 rounded-full appearance-none checked:border-blue-600 checked:border-4 transition-all"
													/>
												</div>
												<span className="text-sm">Ascending (A-Z, 0-9)</span>
											</label>
											<label className="flex items-center gap-3">
												<div className="relative flex items-center">
													<input
														type="radio"
														name="sortDirection"
														checked={sortConfig.direction === "desc"}
														onChange={() =>
															setSortConfig({
																...sortConfig,
																direction: "desc",
															})
														}
														className="w-4 h-4 border-2 border-gray-300 rounded-full appearance-none checked:border-blue-600 checked:border-4 transition-all"
													/>
												</div>
												<span className="text-sm">Descending (Z-A, 9-0)</span>
											</label>
										</div>
									</div>
								</div>

								<div className="flex justify-end gap-3 mt-8">
									<button
										className="px-6 py-2.5 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
										onClick={() => {
											setSortConfig({
												field: "date",
												direction: "desc",
											});
										}}
									>
										Reset
									</button>
									<button
										className="px-6 py-2.5 text-sm bg-[#003F87] text-white rounded-md hover:bg-[#002F65] transition-colors"
										onClick={() => setShowSortModal(false)}
									>
										Apply Sort
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}

				{/* Receipt Modal */}
				{showReceiptModal && selectedPayment && (
					<motion.div
						className="fixed inset-0 z-50"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowReceiptModal(false)}
						/>
						<motion.div
							className="absolute right-0 top-0 bg-white w-[400px] min-h-screen"
							variants={slideIn}
						>
							<div className="p-6">
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-lg font-medium">TRANSACTION DETAILS</h2>
									<button
										onClick={() => setShowReceiptModal(false)}
										title="Close receipt modal"
									>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div
									ref={receiptRef}
									className="space-y-2 divide-y divide-dotted divide-gray-200"
								>
									<div className="flex justify-between items-center pb-3">
										<span className="text-sm text-gray-500">AMOUNT (NGN)</span>
										<span className="font-medium">
											{selectedPayment.amount}
										</span>
									</div>

									<div className="flex justify-between items-center py-3">
										<span className="text-sm text-gray-500">Status</span>
										<span
											className={`text-${
												selectedPayment.status.toLowerCase() === "success"
													? "green"
													: selectedPayment.status.toLowerCase() === "failed"
													? "red"
													: "yellow"
											}-500`}
										>
											{selectedPayment.status}
										</span>
									</div>

									<div className="flex justify-between items-center py-3">
										<span className="text-sm text-gray-500">Date & Time</span>
										<span className="text-sm">
											{selectedPayment.date} · {selectedPayment.time}
										</span>
									</div>

									<div className="flex justify-between items-center py-3">
										<span className="text-sm text-gray-500">Type</span>
										<span className="text-sm">{selectedPayment.type}</span>
									</div>

									{selectedPayment.transactionNo && (
										<div className="flex justify-between items-center py-3">
											<span className="text-sm text-gray-500">
												Transaction No.
											</span>
											<div className="flex items-center gap-2">
												<span className="text-sm">
													{selectedPayment.transactionNo}
												</span>
												<Copy
													className="h-4 w-4 text-gray-400 cursor-pointer"
													onClick={() =>
														copyToClipboard(selectedPayment.transactionNo || "")
													}
												/>
											</div>
										</div>
									)}

									{selectedPayment.paymentType && (
										<div className="flex justify-between items-center py-3">
											<span className="text-sm text-gray-500">
												Payment Type
											</span>
											<span className="text-sm">
												{selectedPayment.paymentType}
											</span>
										</div>
									)}

									{selectedPayment.payeeName && (
										<div className="flex justify-between items-center py-3">
											<span className="text-sm text-gray-500">Payee Name</span>
											<span className="text-sm">
												{selectedPayment.payeeName}
											</span>
										</div>
									)}

									{selectedPayment.regNo && (
										<div className="flex justify-between items-center py-3">
											<span className="text-sm text-gray-500">Reg No.</span>
											<span className="text-sm">{selectedPayment.regNo}</span>
										</div>
									)}

									<div className="flex justify-between items-center pt-3">
										<span className="text-sm text-gray-500">Level</span>
										<span className="text-sm">{selectedPayment.level}</span>
									</div>
								</div>

								<button
									className="w-full bg-[#003F87] text-white py-3 rounded-md mt-8 hover:bg-[#002F65] transition-colors flex items-center justify-center gap-2"
									onClick={() => setShowShareModal(true)}
								>
									<Share2 className="h-4 w-4" />
									Share Receipt
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}

				{/* Share Modal */}
				{showShareModal && selectedPayment && (
					<motion.div
						className="fixed inset-0 z-[60]"
						initial="initial"
						animate="animate"
						exit="exit"
					>
						<motion.div
							className="absolute inset-0 bg-black bg-opacity-50"
							variants={backdrop}
							onClick={() => setShowShareModal(false)}
						/>
						<motion.div
							className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-[350px]"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ type: "spring", damping: 25, stiffness: 300 }}
						>
							<div className="p-6">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-lg font-medium">Share Receipt</h2>
									<button
										onClick={() => setShowShareModal(false)}
										title="Close share modal"
									>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-4">
									<button
										className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
										onClick={generatePDF}
										disabled={shareLoading}
									>
										<Download className="h-5 w-5 text-gray-500" />
										<span>Download as PDF</span>
										{shareLoading && (
											<div className="ml-auto animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
										)}
									</button>

									<button
										className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
										onClick={shareViaEmail}
									>
										<Mail className="h-5 w-5 text-gray-500" />
										<span>Share via Email</span>
									</button>

									<button
										className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
										onClick={printReceipt}
									>
										<Printer className="h-5 w-5 text-gray-500" />
										<span>Print Receipt</span>
									</button>

									<button
										className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
										onClick={generateShareableLink}
									>
										<Link2 className="h-5 w-5 text-gray-500" />
										<span>Generate Link</span>
									</button>

									{shareUrl && (
										<div className="mt-4 p-3 bg-gray-50 rounded-md">
											<div className="flex items-center justify-between">
												<span className="text-sm text-gray-600 truncate">
													{shareUrl}
												</span>
												<button
													className="ml-2 text-blue-600 hover:text-blue-800"
													onClick={() => copyToClipboard(shareUrl)}
												>
													Copy
												</button>
											</div>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
