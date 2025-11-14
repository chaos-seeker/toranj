import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Template } from '@/containers/templates';
import { cn } from '@/utils/cn';
import Providers from './providers';
import { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'ترنج',
};

const peyda = localFont({ src: '../public/fonts/peyda.woff2' });

export default function RootLayout(props: PropsWithChildren) {
  return (
    <html
      suppressHydrationWarning
      dir="rtl"
      className={cn('scrollbar-hide', peyda.className)}
      lang="fa"
    >
      <body className="flex h-dvh flex-col">
        <Providers>
          <Template>{props.children}</Template>
        </Providers>
      </body>
    </html>
  );
}
