import type { Metadata } from "next";

import { ProfilePage } from "@/views/profile";

export async function generateMetadata({ params: { name } }: Props): Promise<Metadata> {
  return { title: `Настройка профиля ${name}` };
}

type Props = {
  params: { name: string };
};

const Page = async (props: Props) => {
  return <ProfilePage {...props} />;
};
export default Page;
