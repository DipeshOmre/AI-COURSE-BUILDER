// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
// Adjust this import based on where you saved the React Bits component
import Particles from "@/components/Particles";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from '@clerk/nextjs'
import Navbar from "../components/Navbar";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "AI Course Builder",
  description: "Generate courses using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
    <html lang="en" className={cn("font-sans", geist.variable)}>
      {/* Background dark kar diya taaki white particles dikhein */}
      <body className="relative min-h-screen bg-slate-950 text-slate-50 antialiased overflow-x-hidden">
        
        {/* Global Particles Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none">
          {/* Removed fixed 1080px width, made it full screen responsive */}
          <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Particles
              particleCount={200}
              particleSpread={10}
              speed={0.1}
              particleColors={["#ffffff", "#ffffff", "#ffffff"]}
              moveParticlesOnHover={false}
              particleHoverFactor={1}
              alphaParticles={false}
              particleBaseSize={100}
              sizeRandomness={1}
              cameraDistance={20}
              disableRotation={false}
            />
          </div>
        </div>
    <Navbar/>
        {/* Aapke baaki pages yahan render honge */}
        <div className="relative z-10">
          {children}
        </div>
        
      </body>
    </html>
    </ClerkProvider>
  );
}