"use client";

import { useState, type ReactNode, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
	Search,
	LayoutDashboard,
	CreditCard,
	Users,
	LifeBuoy,
	Settings,
	X,
	Menu,
	Bell,
	ChevronRight,
} from "lucide-react";

interface DashboardLayoutProps {
	children: ReactNode;
}

const navigation = [
	{
		name: "Search",
		href: "/admin/search",
		icon: Search,
	},
	{
		name: "Dashboard",
		href: "/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		name: "Dues & Payments",
		href: "/admin/dashboard/payment ",
		icon: CreditCard,
	},
	{
		name: "Students",
		href: "/admin/dashboard/student ",
		icon: Users,
	},
	{
		name: "Support",
		href: "/admin/support",
		icon: LifeBuoy,
	},
	{
		name: "Settings",
		href: "/admin/dashboard/settings",
		icon: Settings,
	},
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	const pageTitles: { [key: string]: string } = {
		"/admin/dashboard": "Dashboard",
		"/admin/payments": "Payments",
		"/admin/students": "Student Database",
		"/admin/support": "Support",
		"/admin/settings": "Settings",
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
				} md:translate-x-0 w-64 bg-[#0A2647] text-white transition-transform duration-200 ease-in-out z-50 md:relative flex flex-col`}
			>
				<div className="p-6">
					<div className="flex justify-between items-center">
						<h1 className="text-xl font-bold">CRESA</h1>
						<button
							type="button"
							className="md:hidden"
							onClick={toggleMobileMenu}
							aria-label="Close mobile menu"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-4 space-y-1">
					{navigation.map((item) => {
						const isActive = pathname === item.href;
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-colors ${
									isActive
										? "bg-blue-900 text-white"
										: "text-gray-300 hover:bg-blue-900/50"
								}`}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<item.icon className="h-5 w-5 mr-3" />
								{item.name}
							</Link>
						);
					})}
				</nav>

				{/* Profile */}
				<div className="p-4">
					<div className="flex items-center gap-3 px-4 py-3 hover:bg-blue-900/50 rounded-lg cursor-pointer">
						<Image
							src="/images/avatar.png"
							alt="Profile"
							width={40}
							height={40}
							className="rounded-full"
						/>
						<div className="flex-1 min-w-0">
							<h3 className="text-sm font-medium truncate">Emulo David</h3>
							<p className="text-xs text-gray-400 truncate">
								emulodavid@gmail.com
							</p>
						</div>
						<ChevronRight className="h-4 w-4 text-gray-400" />
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Header/Navbar */}
				<header className="bg-gray-50 p-4 flex justify-between items-center">
					<h2 className="text-2xl font-semibold md:hidden">{pageTitle}</h2>

					{/* Desktop Search */}
					<div className="hidden md:flex flex-1 mx-5 max-w-[800px]">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search Student ID, Date"
								className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="flex items-center space-x-3">
						{/* Desktop: Notifications & Profile */}
						<div className="hidden md:flex items-center space-x-3">
							<button
								type="button"
								title="Notifications"
								className="p-2 rounded-full hover:bg-gray-100"
							>
								<Bell className="h-6 w-6 text-gray-600" />
							</button>
							<Image
								src="/images/avatar.png"
								alt="Profile"
								width={40}
								height={40}
								className="rounded-full"
							/>
						</div>

						{/* Mobile: Menu Button */}
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
				<div className="md:hidden p-4 flex justify-between border-b">
					<div className="flex-1 max-w-lg">
						<div className="relative w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search Student ID, Date"
								className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>
					<div className="flex items-center space-x-3 ml-3">
						<button
							type="button"
							title="Notifications"
							className="p-2 rounded-full hover:bg-gray-100"
						>
							<Bell className="h-6 w-6 text-gray-600" />
						</button>
						<Image
							src="/images/avatar.png"
							alt="Profile"
							width={40}
							height={40}
							className="rounded-full"
						/>
					</div>
				</div>

				{/* Page Content */}
				<main className="flex-1 overflow-auto">{children}</main>
			</div>
		</div>
	);
}
