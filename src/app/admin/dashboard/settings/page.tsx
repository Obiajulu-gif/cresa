"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

export default function SettingsPage() {
	const [selectedImage, setSelectedImage] = useState("/images/avatar.png");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			const imageUrl = URL.createObjectURL(file);
			setSelectedImage(imageUrl);
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="flex justify-center items-center p-6">
			<div className="rounded-lg w-full p-6 md:p-10 relative">
				{/* Settings Title */}
				<h2 className="hidden md:block text-2xl font-semibold text-gray-900 mb-6 md:mb-8">
					Settings
				</h2>
				{/* Mobile View: Stack elements vertically */}
				<div className="flex flex-col md:flex-row md:gap-8">
					{/* Profile Section */}
					<div className="flex flex-col items-center w-full md:w-1/3">
						<div className="relative">
							<Image
								src={selectedImage}
								alt="Profile"
								width={100}
								height={100}
								className="rounded-full"
							/>
							<Check
								className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs rounded-full p-1"
								size={20}
							/>
						</div>
						<h3 className="mt-3 text-lg font-semibold">Profile photo</h3>
						<p className="text-sm text-gray-500 text-center">
							This image will be displayed on your profile
						</p>
						<input
							type="file"
							accept="image/*"
							hidden
							ref={fileInputRef}
							onChange={handleImageChange}
						/>
						<button
							type="button"
							onClick={triggerFileInput}
							className="mt-3 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500 hover:text-white transition"
						>
							Change Photo
						</button>
					</div>

					{/* Personal Information */}
					<div className="w-full md:w-2/3 mt-6 md:mt-0">
						<h3 className="text-lg font-semibold">Personal Information</h3>
						<p className="text-sm text-gray-500 mb-4">
							Update your personal details here.
						</p>

						<form className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-gray-700">
										First name
									</label>
									<input
										type="text"
										defaultValue="David"
										title="First name"
										placeholder="First name"
										className="w-full px-4 py-2 bg-gray-100 border rounded-lg"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-700">
										Last name
									</label>
									<input
										type="text"
										defaultValue="Emulo"
										title="Last name"
										placeholder="Last name"
										className="w-full px-4 py-2 bg-gray-100 border rounded-lg"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-700">
										Reg Number
									</label>
									<input
										type="text"
										defaultValue="2020/248279"
										title="Reg Number"
										placeholder="Reg Number"
										className="w-full px-4 py-2 bg-gray-100 border rounded-lg"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-700">
										Email Address
									</label>
									<input
										type="email"
										defaultValue="Jessicalabert@gmail.com"
										title="Email Address"
										placeholder="Email Address"
										className="w-full px-4 py-2 bg-gray-100 border rounded-lg"
									/>
								</div>
								<div>
									<label className="text-sm font-medium text-gray-700">
										Phone Number
									</label>
									<input
										type="tel"
										defaultValue="+234"
										title="Phone Number"
										placeholder="Phone Number"
										className="w-full px-4 py-2 bg-gray-100 border rounded-lg"
									/>
								</div>
							</div>

							<button
								type="submit"
								className="w-full bg-blue-600 text-white py-2 rounded-lg"
							>
								Save Changes
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
