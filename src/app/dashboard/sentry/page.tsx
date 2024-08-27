import type { Metadata } from "next";

import { SentryPage } from "@/views/sentry";

export const metadata: Metadata = {
  title: "Sentry",
};
const Page = async () => {
  return <SentryPage />;
};
export default Page;
