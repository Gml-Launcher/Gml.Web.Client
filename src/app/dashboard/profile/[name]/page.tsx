import type { Metadata } from 'next';

import { ProfilePage } from '@/views/profile';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  return { title: `Настройка профиля ${name}` };
}

type Props = {
  params: { name: string };
};

const Page = async (props: Props) => {
  const { params } = props;
  const awaitedParams = await params;

  return <ProfilePage params={awaitedParams} />;
};
export default Page;
