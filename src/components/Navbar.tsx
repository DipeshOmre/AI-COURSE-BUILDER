// src/components/Navbar.tsx
'use client';
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Sparkles } from "lucide-react";
import React from "react";

export default function Navbar() {
    // Clerk ka brain
    const { isLoaded, userId } = useAuth();
  
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight hover:text-blue-400 transition-colors">
          <Sparkles className="w-5 h-5 text-blue-500" />
          AI Course Builder
        </Link>

        {/* Auth Buttons */}
        <div>
          {/* 👇 NAYA LOGIC: Agar Clerk load ho gaya aur User nahi hai (Logged Out) */}
          {isLoaded && !userId && (
            <div className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              <SignInButton mode="modal" />
            </div>
          )}

          {/* 👇 NAYA LOGIC: Agar Clerk load ho gaya aur User hai (Logged In) */}
          {isLoaded && userId && (
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                My Courses
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-slate-700" } }} />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}