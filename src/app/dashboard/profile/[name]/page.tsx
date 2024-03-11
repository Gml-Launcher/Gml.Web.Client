import { ProfilePage } from "@/pages/Profile";
import type { Metadata } from "next";

type PageProps = {
  params: { name: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Редактирование профиля — ${params.name}`,
  };
}

export default ProfilePage;
