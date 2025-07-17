"use client";

import { useSelector } from "react-redux";
import { useState } from "react";

import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileForm() {
  const user = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    profilePic: user?.profilePic || "",
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
    <div className="min-h-screen bg-background text-foreground py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-10">
        {/* Profile Card */}
        <Card className="w-full border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Upload */}
              <label htmlFor="profilePic" className="cursor-pointer relative">
                <Avatar className="w-24 h-24 border-4 border-orange-200">
                  <AvatarImage src={formData.profilePic} alt="Profile Picture" />
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

              {/* Name Info */}
              <div className="space-y-1">
                <h1 className="text-3xl font-bold">
                  {formData.firstName} {formData.lastName}
                </h1>
                <p className="text-muted-foreground">Personal Information</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="w-full border-0 shadow-md">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full bg-background border-muted"
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
                    className="w-full bg-background border-muted"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="w-full bg-background border-muted opacity-60 cursor-not-allowed"
                  />
                  <span className="text-sm text-muted-foreground">
                    Non-editable field
                  </span>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    readOnly
                    className="w-full bg-background border-muted opacity-60 cursor-not-allowed"
                  />
                  <span className="text-sm text-muted-foreground">
                    Non-editable field
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-300 py-3 text-lg font-semibold"
              >
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
