"use client";

import { useState, ReactNode, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
	Search,
	Home,
	CreditCard,
	LifeBuoy,
	Settings,
	X,
	Menu,
	Bell,
} from "lucide-react";

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	// Map URLs to dynamic titles
	const pageTitles: { [key: string]: string } = {
		"/student-dashboard": "Dashboard",
		"/student-dashboard/payment": "Payments",
		"/support": "Support",
		"/settings": "Settings",
	};
	const pageTitle = pageTitles[pathname] || "Page";

	const toggleMobileMenu = useCallback(() => {
		setIsMobileMenuOpen((prev) => !prev);
	}, []);

	return (
		<div className="flex h-screen overflow-hidden bg-gray-50">
			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={toggleMobileMenu}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 transform ${
					isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0 max-w-[16rem] w-full bg-[#0A2647] text-white transition-transform duration-200 ease-in-out z-50 md:relative`}
			>
				<div className="p-6 flex justify-between items-center">
					<h1 className="text-xl font-bold">CRESA</h1>
					<button
						type="button"
						className="md:hidden"
						onClick={toggleMobileMenu}
						aria-label="Close mobile menu"
					>
						<X className="h-6 w-6" aria-hidden="true" />
					</button>
				</div>
				<nav className="mt-6">
					<div className="px-4 space-y-2">
						<Link
							href="/"
							className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-900 rounded-lg"
							onClick={toggleMobileMenu}
						>
							<Home className="h-5 w-5 mr-3" aria-hidden="true" />
							Dashboard
						</Link>
						<Link
							href="/payments"
							className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-900 rounded-lg"
							onClick={toggleMobileMenu}
						>
							<CreditCard className="h-5 w-5 mr-3" aria-hidden="true" />
							Payments
						</Link>
						<Link
							href="/support"
							className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-900 rounded-lg"
							onClick={toggleMobileMenu}
						>
							<LifeBuoy className="h-5 w-5 mr-3" aria-hidden="true" />
							Support
						</Link>
						<Link
							href="/settings"
							className="flex items-center px-4 py-2 text-gray-300 hover:bg-blue-900 rounded-lg"
							onClick={toggleMobileMenu}
						>
							<Settings className="h-5 w-5 mr-3" aria-hidden="true" />
							Settings
						</Link>
					</div>
				</nav>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header/Navbar */}
				<header className="bg-gray-50 p-4 flex justify-between items-center ">
					<h2 className="text-2xl font-semibold md:hidden">{pageTitle}</h2>

					{/* Desktop Search */}
					<div className="hidden md:flex flex-1 mx-5 max-w-[800px]">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search Student ID, Date"
								className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						{/* Desktop: Notifications & Profile */}
						<div className="hidden md:flex items-center space-x-3">
							<button
								type="button"
								title="Notifications"
								className="bg-gray-100 p-2 rounded-full flex items-center justify-center"
							>
								<Bell className="h-7 w-7 text-gray-600" />
							</button>
							<Image
								src="/images/avatar.png"
								alt="Profile"
								width={60}
								height={60}
								className="rounded-full"
							/>
						</div>

						{/* Mobile: Hamburger Button */}
						<button
							type="button"
							className="md:hidden text-gray-600"
							onClick={toggleMobileMenu}
							aria-label="Open mobile menu"
						>
							<Menu className="h-6 w-6" />
						</button>
					</div>
				</header>

				{/* Mobile Search Bar */}
				<div className="md:hidden p-4  flex justify-between">
					<div className="flex-1 max-w-lg">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search Student ID, Date"
								className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
					<div className="flex items-center space-x-3 ml-3">
						<button
							type="button"
							title="Notifications"
							className="bg-gray-100 p-2 rounded-full flex items-center justify-center"
						>
							<Bell className="h-5 w-5 text-gray-600" />
						</button>
						<Image
							src="/images/avatar.png"
							alt="Profile"
							width={46}
							height={46}
							className="rounded-full"
						/>
					</div>
				</div>

				{/* Page Content */}
				<main className="flex-1 overflow-auto p-4">{children}</main>
			</div>
		</div>
	);
}
