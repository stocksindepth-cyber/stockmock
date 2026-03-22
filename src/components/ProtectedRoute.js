"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Target } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !currentUser) {
      // Redirect unauthorized navigations seamlessly to the Login Wall
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [currentUser, loading, router, pathname, mounted]);

  // Block rendering and show high-fidelity loading state while Firebase resolves tokens
  if (loading || !mounted) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#080C16] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <Target className="w-12 h-12 text-blue-500 animate-pulse relative z-10" />
          <Loader2 className="w-16 h-16 text-emerald-400 animate-spin absolute" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">OptionsGyani Auth</h2>
        <p className="text-slate-400 font-medium text-sm animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  // If completely unauthenticated, render nothing while the Next.js router transitions
  if (!currentUser) {
    return null;
  }

  // Authorized user - render the requested analytical engine
  return <>{children}</>;
}
