"use client";

import { useState } from "react";
import {
	Filter,
	MoreVertical,
	Download,
	X,
	Copy,
	ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Payment {
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

export default function PaymentsPage() {
	const [activeTab, setActiveTab] = useState("all");
	const [showReceiptModal, setShowReceiptModal] = useState(false);
	const [showAddDueModal, setShowAddDueModal] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
	const [showLevelAmounts, setShowLevelAmounts] = useState(false);

	const payments: Payment[] = [
		{
			session: "2024/2025",
			studentID: "2020/247853",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "400 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "SUCCESS",
			transactionNo: "240415016442124566",
			paymentType: "Bank Transfer",
			payeeName: "Emulo David Nnaoma",
			regNo: "2020/248279",
		},
		{
			session: "2024/2025",
			studentID: "2020/247875",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "300 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Success",
			transactionNo: "240415016442124567",
			paymentType: "Bank Transfer",
			payeeName: "Emulo David Nnaoma",
			regNo: "2020/248279",
		},
		{
			session: "2024/2025",
			studentID: "2020/257868",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "300 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Failed",
			transactionNo: "240415016442124568",
			paymentType: "Bank Transfer",
			payeeName: "Emulo David Nnaoma",
			regNo: "2020/248279",
		},
		{
			session: "2024/2025",
			studentID: "2020/247875",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "200 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Success",
			transactionNo: "240415016442124569",
			paymentType: "Bank Transfer",
			payeeName: "Emulo David Nnaoma",
			regNo: "2020/248279",
		},
		{
			session: "2024/2025",
			studentID: "2020/247875",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "100 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Success",
			transactionNo: "240415016442124570",
			paymentType: "Bank Transfer",
			payeeName: "Emulo David Nnaoma",
			regNo: "2020/248279",
		},
	];

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
					className="px-4 py-2 rounded-md bg-white hover:bg-gray-50 flex items-center gap-2"
					onClick={() => setActiveTab("dept")}
				>
					<div className="w-2 h-2 rounded-full bg-gray-400" />
					Departmental Dues
					<MoreVertical className="h-4 w-4 text-gray-400" />
				</button>
			</div>

			{/* Table Section */}
			<div className="bg-white rounded-lg shadow">
				{/* Table Header Controls */}
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="font-semibold">All Dues</h2>
					<div className="flex items-center gap-4">
						<button className="flex items-center gap-2 text-gray-500 text-sm">
							<Filter className="h-4 w-4" />
							Filter
						</button>
						<button className="flex items-center gap-2 text-gray-500 text-sm">
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
							{payments.map((payment, i) => (
								<tr key={i} className="text-sm">
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
												payment.status === "Pending"
													? "bg-yellow-100 text-yellow-800"
													: payment.status === "Failed"
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
											<button>
												<MoreVertical className="h-4 w-4 text-gray-400" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Animated Modals */}
			<AnimatePresence>
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
							<div className="p-6">
								<div className="flex justify-between items-center mb-8">
									<h2 className="text-lg font-medium">ADD NEW DUE</h2>
									<button onClick={() => setShowAddDueModal(false)}>
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
											className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
											placeholder="Enter title"
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
														defaultChecked
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
										className="px-6 py-2.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
										onClick={() => setShowAddDueModal(false)}
									>
										Cancel
									</button>
									<button className="px-6 py-2.5 text-sm bg-[#003F87] text-white rounded-md hover:bg-[#002F65] transition-colors">
										Proceed
									</button>
								</div>
							</div>
						</motion.div>
					</motion.div>
				)}

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
									<button onClick={() => setShowReceiptModal(false)}>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								<div className="space-y-2 divide-y divide-dotted divide-gray-200">
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
												selectedPayment.status === "SUCCESS"
													? "green"
													: selectedPayment.status === "Failed"
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
												<Copy className="h-4 w-4 text-gray-400 cursor-pointer" />
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

								<button className="w-full bg-[#003F87] text-white py-3 rounded-md mt-8 hover:bg-[#002F65] transition-colors">
									Share Receipt
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
