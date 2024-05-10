import type { Metadata } from "next";

import { SettingsPage } from "@/pages/settings";

export const metadata: Metadata = {
  title: "Настройки платформы",
};
const Page = async () => {
  return <SettingsPage />;
};
export default Page;
