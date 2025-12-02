import { ReactNode } from 'react';
import dynamicImport from 'next/dynamic';

const AppShell = dynamicImport(
  () => import('@/components/layout/AppShell').then((mod) => mod.AppShell),
  { ssr: false }
);

export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
