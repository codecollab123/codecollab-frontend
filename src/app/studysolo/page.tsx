"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/AuthContext";
// Adjust the import as needed
import SoloStudy from "@/components/studysolo/studysolo";

export default function SoloStudyPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return <p>Loading your study room...</p>;

  return <SoloStudy userId={user.uid} />;
}
