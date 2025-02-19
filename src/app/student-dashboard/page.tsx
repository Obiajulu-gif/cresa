"use client";

import Link from "next/link";
import {  CreditCard, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Dashboard() {
	const [showAmount, setShowAmount] = useState(false);
	
	return (
		<div>
			{/* Main Content */}
			<main className="flex-1 overflow-auto">
				
				<div className="p-4 pt-1 md:p-8">
					{/* Search Bar - Full width on mobile */}
					{/* <div className="mb-6 flex items-center space-x-4">
						<div className="relative flex-grow">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search Student ID, Date"
								className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="flex items-center space-x-2">
							<Bell className="h-6 w-6 text-gray-600" />
							<Image
								src="/images/avatar.png"
								alt="Profile"
								width={42}
								height={42}
								className="rounded-full"
							/>
						</div>
					</div> */}
					<div className="flex justify-between items-center p-4">
						{/* Dashboard Title */}
						<h1 className="hidden md:block text-3xl font-semibold text-gray-900">Dashboard</h1>

						{/* Pay Dues Button */}
						<button className="bg-[#003F87] text-white px-4 py-2 rounded-md hover:bg-[#002F65] transition">
							Pay Dues
						</button>
					</div>

					{/* Stats Cards - Stack on mobile */}
					<div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-8">
					
								<div className="bg-blue-900 text-white p-6 rounded-lg">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm font-bold mb-1">Total Paid Dues</p>
											<h2 className="text-2xl md:text-3xl font-bold">
												{showAmount ? "NGN 1,240,000" : "********"}<span className="text-sm"></span>
											</h2>
										</div>
										<div
											className="bg-blue-800 p-2 rounded-full cursor-pointer"
											onClick={() => setShowAmount((prev) => !prev)}
										>
											{showAmount ? (
												<EyeOff className="h-6 w-6" />
											) : (
												<Eye className="h-6 w-6" />
											)}
										</div>
									</div>
								</div>
						
						<div className="bg-red-50 text-red-900 p-6 rounded-lg">
							<div className="flex justify-between items-center">
								<div>
									<p className="text-sm mb-1">Total Unpaid Dues</p>
									<h2 className="text-2xl md:text-3xl font-bold">
										NGN 540,000<span className="text-sm">.00</span>
									</h2>
								</div>
								<div className="bg-red-100 text-red-500 p-2 rounded-full">
									<CreditCard className="h-6 w-6" />
								</div>
							</div>
						</div>
					</div>

					{/* Transactions Table */}
					<div className="bg-white rounded-lg shadow">
						<div className="flex justify-between items-center p-4 md:p-6 border-b">
							<h2 className="text-lg font-semibold">Recent Transactions</h2>
							<Link
								href="#"
								className="text-blue-600 flex items-center text-sm"
							>
								See all <ChevronRight className="h-4 w-4" />
							</Link>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 text-sm text-gray-500">
									<tr>
										<th className="px-4 py-3 text-left md:hidden">Type</th>
										<th className="px-4 py-3 text-left md:hidden">Level</th>
										<th className="px-4 py-3 text-left md:hidden">Status</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Academic Session
										</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Amount (NGN)
										</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Type
										</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Level
										</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Date Created
										</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Link Type
										</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Status
										</th>
										<th className="hidden md:table-cell px-6 py-3 text-left">
											Receipt
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{[...Array(5)].map((_, i) => (
										<tr key={i} className="text-sm">
											<td className="px-4 py-3 md:hidden">Dept. Dues</td>
											<td className="px-4 py-3 md:hidden">
												{400 - i * 100} lvl
											</td>
											<td className="px-4 py-3 md:hidden">
												<span
													className={`px-2 py-1 rounded-full text-xs ${
														i === 0
															? "bg-yellow-100 text-yellow-800"
															: i === 2
															? "bg-red-100 text-red-800"
															: "bg-green-100 text-green-800"
													}`}
												>
													{i === 0 ? "Pending" : i === 2 ? "Failed" : "Success"}
												</span>
											</td>
											<td className="hidden md:table-cell px-6 py-4">
												2020/2024
											</td>
											<td className="hidden md:table-cell px-6 py-4">
												3,000.34
											</td>
											<td className="hidden md:table-cell px-6 py-4">
												Dept. Dues
											</td>
											<td className="hidden md:table-cell px-6 py-4">
												{400 - i * 100} lvl
											</td>
											<td className="hidden md:table-cell px-6 py-4">
												Apr 12, 2023 - 09:32AM
											</td>
											<td className="hidden md:table-cell px-6 py-4">-</td>
											<td className="hidden md:table-cell px-6 py-4">
												<span
													className={`px-2 py-1 rounded-full text-xs ${
														i === 0
															? "bg-yellow-100 text-yellow-800"
															: i === 2
															? "bg-red-100 text-red-800"
															: "bg-green-100 text-green-800"
													}`}
												>
													{i === 0 ? "Pending" : i === 2 ? "Failed" : "Success"}
												</span>
											</td>
											<td className="hidden md:table-cell px-6 py-4">
												<button className="text-blue-600 hover:text-blue-800">
													View Receipt
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
