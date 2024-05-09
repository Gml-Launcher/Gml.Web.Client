import type { Metadata } from "next";

import { ProfilePage } from "@/screens/profile";

type PageProps = {
  params: { name: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Редактирование профиля — ${params.name}`,
  };
}

export default ProfilePage;
