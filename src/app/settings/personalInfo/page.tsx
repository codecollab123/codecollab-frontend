"use client";
import { useSelector } from "react-redux";
import { useState } from "react";

import { RootState } from "@/lib/store";
import SidebarMenu from "@/components/menu/sidebarmenu";
import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  menuItemsBottom,
  menuItemsTop,
} from "@/config/menuItems/dashboardMenuItem";
import ProfilePictureUpload from "@/components/fileUpload/profilePicture";
import { Textarea } from "@/components/ui/textarea";
export default function PersonalInfo() {
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profilePic: user?.profilePic || "",
    techstacks:user?.techstacks || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePic: imageUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Profile Data:", formData);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Header at the top */}
      <Header
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        activeMenu="Personal Info"
        breadcrumbItems={[
          { label: "Settings", link: "#" },
          { label: "Personal Info", link: "#" },
        ]}
      />

      <div className="flex flex-col sm:flex-row">
        <SidebarMenu
          menuItemsTop={menuItemsTop}
          menuItemsBottom={menuItemsBottom}
          active="Personal Info"
        />
        <main className="flex-1 flex flex-col items-center justify-center text-white p-8">
          <div className="w-full max-w-6xl p-8 shadow-lg rounded-lg">
            {/* Profile Picture */}
            <div className="flex justify-center mb-6">
              <label htmlFor="profilePic" className="cursor-pointer relative">
                <Avatar className="w-28 h-28 border-2 border-gray-500">
                  <AvatarImage
                    src={formData.profilePic}
                    alt="Profile Picture"
                  />
                  <AvatarFallback>+</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  id="profilePic"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className="w-full "
                  />
                </div>

                {/* Email & Phone */}
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    readOnly
                    className="w-full opacity-50 cursor-not-allowed"
                  />
                  <span className="text-sm text-gray-400">
                    Non-editable field
                  </span>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    placeholder="Enter your phone number"
                    readOnly
                    className="w-full "
                  />
                  <span className="text-sm text-gray-400">
                    Non-editable field
                  </span>
                </div>
                <div>
                  <Label>Tech Stacks</Label>
                  <Input
                    type="text"
                    name="techStacks"
                    placeholder="Enter your skills"
                    readOnly
                    className="w-full"
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    className="w-full "
                      placeholder="Enter your bio"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full py-3">
                Save changes
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
