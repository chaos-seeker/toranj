'use client';

import { PropsWithChildren } from 'react';
import { Header } from './header';

export function Dashboard(props: PropsWithChildren) {
  return (
    <div className="flex h-full flex-col lg:flex-row-reverse">
      <Header />
      <main className="container my-6 flex w-full">{props.children}</main>
    </div>
  );
}
