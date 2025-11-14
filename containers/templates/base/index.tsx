'use client';

import { PropsWithChildren } from 'react';
import { Footer } from './footer';
import { Header } from './header';
import { ModalLogin } from './modal-login';
import { ModalRegister } from './modal-register';

export function Base(props: PropsWithChildren) {
  return (
    <>
      <ModalLogin />
      <ModalRegister />
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-14">
        {props.children}
      </main>
      <Footer />
    </>
  );
}
