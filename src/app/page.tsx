"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/custom/AppSidebar";
import Dashboard from "@/components/custom/dashboard";
import Profile from "@/components/custom/profile";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<"dashboard" | "profile">("dashboard");

  return (
    <div>
      <SidebarProvider>
        <AppSidebar onProfileClick={() => setCurrentSection("profile")} />
        <main className="w-full">
          {currentSection === "dashboard" ? (
            <Dashboard />
          ) : (
            <Profile />
          )}
        </main>
      </SidebarProvider>
    </div>
  );
}
