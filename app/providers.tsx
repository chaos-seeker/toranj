'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProgressBar } from 'next-nprogress-bar';
import type { PropsWithChildren } from 'react';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { Loader } from '@/components/loader';
import { trpc } from '@/lib/trpc';

const ProgressBar = () => {
  return (
    <AppProgressBar
      height="4px"
      color="#183D3D"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};

const Toast = () => {
  return <Toaster />;
};

const ReactQuery = (props: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {props.children}
      </QueryClientProvider>
    </trpc.Provider>
  );
};

export default function Providers(props: PropsWithChildren) {
  return (
    <>
      <Toast />
      <ProgressBar />
      <ReactQuery>
        <Suspense fallback={<Loader />}>{props.children}</Suspense>
      </ReactQuery>
    </>
  );
}
