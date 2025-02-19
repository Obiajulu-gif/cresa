"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ChevronRight, Plus, User, FileText } from "lucide-react";

export default function Dashboard() {
	const [showAmount, setShowAmount] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	return (
		<div className="p-6 bg-gray-100 min-h-screen">
			{/* Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

				{/* "Add New" Button with Dropdown */}
				<div className="relative">
					<button
						onClick={() => setDropdownOpen(!dropdownOpen)}
						className="flex items-center gap-2 bg-[#003F87] text-white px-4 py-2 rounded-md hover:bg-[#002F65] transition"
					>
						<Plus size={18} />
						Add New
					</button>

					{/* Dropdown */}
					{dropdownOpen && (
						<div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md">
							<button className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
								<User size={16} /> New Student
							</button>
							<button className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
								<FileText size={16} /> Add New Due
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Stats Section */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
				{/* Total Paid Dues */}
				<div className="bg-blue-900 text-white p-6 rounded-lg flex justify-between items-center">
					<div>
						<p className="text-sm font-bold mb-1">Total Paid Dues</p>
						<h2 className="text-3xl font-bold">
							{showAmount ? "NGN 9,020,000.00" : "********"}
						</h2>
					</div>
					<button
						className="p-2 rounded-full bg-blue-800"
						onClick={() => setShowAmount((prev) => !prev)}
					>
						{showAmount ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
				</div>

				{/* Other Cards */}
				<div className="bg-blue-50 text-gray-900 p-6 rounded-lg">
					<p className="text-sm font-bold mb-1">Total NO. of Students</p>
					<h2 className="text-3xl font-bold">224</h2>
				</div>

				<div className="bg-green-50 text-gray-900 p-6 rounded-lg">
					<p className="text-sm font-bold mb-1">Total Student Paid</p>
					<h2 className="text-3xl font-bold">156</h2>
				</div>

				<div className="bg-red-50 text-gray-900 p-6 rounded-lg">
					<p className="text-sm font-bold mb-1">Total Student Unpaid</p>
					<h2 className="text-3xl font-bold">68</h2>
				</div>
			</div>

			{/* Recent Transactions */}
			<div className="bg-white shadow rounded-lg">
				<div className="flex justify-between items-center p-4 border-b">
					<h2 className="text-lg font-semibold">Recent Transactions</h2>
					<Link href="#" className="text-blue-600 flex items-center text-sm">
						See all <ChevronRight size={16} />
					</Link>
				</div>

				{/* Transactions Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="bg-gray-50 text-gray-500">
							<tr>
								<th className="px-4 py-3 text-left">Academic Session</th>
								<th className="px-4 py-3 text-left">Student ID</th>
								<th className="px-4 py-3 text-left">Amount (NGN)</th>
								<th className="px-4 py-3 text-left">Type</th>
								<th className="px-4 py-3 text-left">Level</th>
								<th className="px-4 py-3 text-left">Date Created</th>
								<th className="px-4 py-3 text-left">Link Type</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{[
								{
									id: "2020/247853",
									level: "400 lvl",
									status: "Pending",
									color: "yellow",
								},
								{
									id: "2020/247875",
									level: "300 lvl",
									status: "Success",
									color: "green",
								},
								{
									id: "2020/257868",
									level: "300 lvl",
									status: "Failed",
									color: "red",
								},
								{
									id: "2020/247875",
									level: "200 lvl",
									status: "Success",
									color: "green",
								},
								{
									id: "2020/247875",
									level: "100 lvl",
									status: "Success",
									color: "green",
								},
							].map((transaction, index) => (
								<tr key={index} className="text-gray-900">
									<td className="px-4 py-3">2024/2025</td>
									<td className="px-4 py-3">{transaction.id}</td>
									<td className="px-4 py-3">3,000.34</td>
									<td className="px-4 py-3">Dept. Dues</td>
									<td className="px-4 py-3">{transaction.level}</td>
									<td className="px-4 py-3">Apr 12, 2023 | 09:32AM</td>
									<td className="px-4 py-3">
										<span
											className={`px-2 py-1 rounded-full text-xs bg-${transaction.color}-100 text-${transaction.color}-800`}
										>
											{transaction.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
