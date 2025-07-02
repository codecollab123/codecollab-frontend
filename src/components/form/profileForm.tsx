'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function ProfileForm() {
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePic: user?.profilePic || '',
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
    console.log('Updated Profile Data:', formData);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white">
      <div className="w-full max-w-6xl p-8 shadow-lg rounded-lg">
        {/* Header */}
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <label htmlFor="profilePic" className="cursor-pointer relative">
            <Avatar className="w-28 h-28 border-2 border-gray-500">
              <AvatarImage src={formData.profilePic} alt="Profile Picture" />
              <AvatarFallback>+</AvatarFallback>
            </Avatar>
            <input type="file" id="profilePic" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <Label>First Name</Label>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter your first name" required className="w-full bg-gray-800 border-gray-700" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter your last name" required className="w-full bg-gray-800 border-gray-700" />
            </div>

            {/* Email & Phone */}
            <div>
              <Label>Email</Label>
              <Input type="email" name="email" value={formData.email} placeholder="Enter your email" readOnly className="w-full bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed" />
              <span className="text-sm text-gray-400">Non-editable field</span>
            </div>
            <div>
              <Label>Phone</Label>
              <Input type="tel" name="phone" value={formData.phone|| ""} placeholder="Enter your phone number" readOnly className="w-full bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed" />
              <span className="text-sm text-gray-400">Non-editable field</span>
            </div>

            {/* Company Details */}
            
            
           
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300 py-3 text-lg font-semibold">
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}
