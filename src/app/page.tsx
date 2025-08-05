"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/custom/AppSidebar";
import Dashboard from "@/components/custom/dashboard";
import Profile from "@/components/custom/profile";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  const [currentSection, setCurrentSection] = useState<"dashboard" | "profile">(
    "dashboard"
  );
  const [profileSaved, setProfileSaved] = useState(0);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const handleProfileClick = () => {
    setCurrentSection("profile");
  };

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email);
    setCurrentSection("dashboard");
  };

  const handleProfileSaved = () => {
    setProfileSaved((prev) => prev + 1);
  };

  return (
    <div>
      <SidebarProvider>
        <AppSidebar
          key={profileSaved}
          onProfileClick={handleProfileClick}
          onEmailClick={handleEmailClick}
        />
        <main className="w-full">
          {currentSection === "dashboard" ? (
            <Dashboard selectedEmail={selectedEmail} />
          ) : (
            <Profile onProfileSaved={handleProfileSaved} />
          )}
        </main>
      </SidebarProvider>
    </div>
  );
}
