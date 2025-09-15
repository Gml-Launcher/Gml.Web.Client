"use client";

import React from "react";

import { EditSettingsPlatformForm } from "@/features/edit-settings-platform-form";

// This tab reuses EditSettingsPlatformForm as-is to minimize code changes.

export const ApiKeysTab: React.FC = () => {
  // The existing EditSettingsPlatformForm already contains fields for CurseForge and VK API keys.
  // To minimize changes, we simply reuse that form here; ideally, form could accept "section" prop.
  return (
    <div className="w-full">
      <EditSettingsPlatformForm />
    </div>
  );
};

export default ApiKeysTab;
