'use client';

import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { Base } from './base';
import { Dashboard } from './dashboard';

export function Template(props: PropsWithChildren) {
  const pathname = usePathname();
  const isRouteDashboard = pathname.includes('/dashboard');

  return isRouteDashboard ? (
    <Dashboard>{props.children}</Dashboard>
  ) : (
    <Base>{props.children}</Base>
  );
}
