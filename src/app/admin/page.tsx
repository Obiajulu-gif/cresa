"use client"

import { useState } from "react"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
		<div className="min-h-screen flex">
			<div className="hidden md:block md:w-1/2 relative">
				<Image
					src="/images/admin-login.png"
					alt="Student working on laptop"
					fill
					className="object-cover"
					priority
				/>
			</div>
			<div className="w-full md:w-1/2 flex items-center justify-center p-8">
				<div className="w-full max-w-md space-y-8">
					<div className="space-y-2">
						<h1 className="text-2xl font-semibold tracking-tight">
							Login with your ID
						</h1>
						<p className="text-sm text-gray-500">
							Enter ID to access your dashboard
						</p>
					</div>
					<form className="space-y-4">
						<div className="space-y-2">
							<input
								type="text"
								placeholder="ID no"
								className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="space-y-2 relative">
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition-colors"
						>
							Login
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

