import { ReactNode } from 'react';

import { ClientTransition } from './ClientTransition';

export const metadata = {
  title: 'Gml Первый запуск',
};

export default function MntLayout({ children }: { children: ReactNode }) {
  return <ClientTransition>{children}</ClientTransition>;
}
