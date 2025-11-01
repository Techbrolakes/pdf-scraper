"use client";

import { useState } from "react";
import { User, Lock, Settings } from "lucide-react";
import { ProfileSection } from "./profile-section";
import { PasswordSection } from "./password-section";
import { AccountSection } from "./account-section";
import { StatsSection } from "./stats-section";

interface SettingsTabsProps {
  name: string;
  email: string;
  totalResumes: number;
  createdAt: Date;
}

type TabId = "profile" | "security" | "account";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: Tab[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "account", label: "Account", icon: Settings },
];

export function SettingsTabs({
  name,
  email,
  totalResumes,
  createdAt,
}: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("profile");

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-2">
        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center cursor-pointer justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <StatsSection totalResumes={totalResumes} createdAt={createdAt} />
            <ProfileSection initialName={name} email={email} />
          </div>
        )}

        {activeTab === "security" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <PasswordSection />
          </div>
        )}

        {activeTab === "account" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <AccountSection />
          </div>
        )}
      </div>
    </div>
  );
}
