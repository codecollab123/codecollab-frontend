"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { setUser } from "@/lib/userSlice";
import { axiosInstance } from "@/lib/axiosinstance";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileFormSchema = z.object({
  firstName: z.string().min(2, { message: "At least 2 characters required" }),
  lastName: z.string().min(2, { message: "At least 2 characters required" }),
  bio: z.string().optional(),
  location: z.string().optional(),
  photoURL: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function EditProfile() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      bio: user.bio || "",
      location: user.location || "",
      photoURL: user.photoURL || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    form.reset({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      bio: user.bio || "",
      location: user.location || "",
      photoURL: user.photoURL || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
    });
  }, [user, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    console.log("Form Data:", data); 
    
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/user/update/${user._id}`, data)

      const updatedUser = res.data.data;

      dispatch(setUser(updatedUser)); // update redux with new profile
      toast({ title: "Profile updated successfully" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      {/* ✅ Profile Picture Avatar */}
      <div className="flex justify-center mb-6">
        <Avatar className="w-32 h-32 border-4 border-green-400 neon-glow">
          <AvatarImage
            src={user?.photoURL || "/user.png"}
            alt="Profile Picture"
          />
          <AvatarFallback className="text-2xl">
            {user?.firstName?.[0] ?? "U"}
            {user?.lastName?.[0] ?? "P"}
          </AvatarFallback>
        </Avatar>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="Your bio..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Your location..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/yourname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/yourname"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
