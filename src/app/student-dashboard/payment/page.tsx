"use client";

import Image from "next/image";
import { Search, Filter, ChevronDown } from "lucide-react";

export default function PaymentsPage() {
	// Dummy payment data
	const payments = [
		{
			session: "2020/2024",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "400 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Pending",
		},
		{
			session: "2020/2024",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "300 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Success",
		},
		{
			session: "2020/2024",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "300 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Failed",
		},
		{
			session: "2020/2024",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "200 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Success",
		},
		{
			session: "2020/2024",
			amount: "3,000.34",
			type: "Dept. Dues",
			level: "100 lvl",
			date: "Apr 12, 2023",
			time: "09:32AM",
			status: "Success",
		},
	];

	return (
		<div className="flex h-screen flex-col bg-gray-50">
			{/* Header Section */}
			<div className="flex justify-between items-center p-4">
				<h1 className="text-2xl font-semibold text-gray-900">Payments</h1>
				<button className="bg-[#003F87] text-white px-4 py-2 rounded-md hover:bg-[#002F65] transition">
					Pay New Dues
				</button>
			</div>

			{/* Filters */}
			<div className="flex items-center gap-3 px-4 py-3 ">
				<div className="relative w-full">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<input
						type="text"
						placeholder="Search Student ID, Date"
						className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white text-orange-500 border-orange-500">
					<Filter className="h-4 w-4" />
					Filter
				</button>
			</div>

			{/* Payments Table */}
			<div className="flex-1 overflow-hidden bg-white rounded-lg shadow-md m-4">
				<div className="overflow-x-auto">
					<table className="w-full text-sm text-gray-700">
						{/* Table Header */}
						<thead className="bg-gray-50 text-gray-500">
							<tr className="hidden md:table-row">
								<th className="px-6 py-3 text-left">Academic Session</th>
								<th className="px-6 py-3 text-left">Amount (NGN)</th>
								<th className="px-6 py-3 text-left">Type</th>
								<th className="px-6 py-3 text-left">Level</th>
								<th className="px-6 py-3 text-left">Date Created</th>
								<th className="px-6 py-3 text-left">Link Type</th>
								<th className="px-6 py-3 text-left">Receipt</th>
							</tr>

							{/* Mobile Header */}
							<tr className="md:hidden">
								<th className="px-6 py-3 text-left">Type</th>
								<th className="px-6 py-3 text-left">Level</th>
								<th className="px-6 py-3 text-left">Link Type</th>
							</tr>
						</thead>

						{/* Table Body */}
						<tbody className="divide-y divide-gray-200">
							{payments.map((payment, i) => (
								<>
									{/* Desktop View */}
									<tr key={i} className="hidden md:table-row hover:bg-gray-50">
										<td className="px-6 py-4">{payment.session}</td>
										<td className="px-6 py-4">{payment.amount}</td>
										<td className="px-6 py-4">{payment.type}</td>
										<td className="px-6 py-4">{payment.level}</td>
										<td className="px-6 py-4">
											{payment.date} - {payment.time}
										</td>
										<td className="px-6 py-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${
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
											<button className="text-blue-600 hover:text-blue-800 text-sm">
												View Receipt
											</button>
										</td>
									</tr>

									{/* Mobile View */}
									<tr key={i} className="md:hidden hover:bg-gray-50">
										<td className="px-6 py-4">{payment.type}</td>
										<td className="px-6 py-4">{payment.level}</td>
										<td className="px-6 py-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-medium ${
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
									</tr>
								</>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
