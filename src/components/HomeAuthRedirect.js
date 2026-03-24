"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Renders nothing — silently redirects logged-in users to /dashboard.
// Kept as a tiny isolated client component so the homepage stays a Server Component.
export default function HomeAuthRedirect() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  useEffect(() => {
    if (!loading && currentUser) router.replace("/dashboard");
  }, [currentUser, loading, router]);
  return null;
}
