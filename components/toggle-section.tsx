'use client';

import { ReactNode, useEffect } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { cn } from '@/utils/cn';

interface IToggleSectionProps {
  children: ReactNode;
  onClose: () => void;
  isShow: boolean;
  isBackDrop?: boolean;
  className?: string;
}

export function ToggleSection(props: IToggleSectionProps) {
  useEffect(() => {
    if (props.isShow && props.isBackDrop) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [props.isShow, props.isBackDrop]);

  return (
    <section>
      <button
        onClick={() => props.onClose()}
        className={cn('fixed inset-0 z-40 transition-all', {
          show: props.isShow,
          hide: !props.isShow,
          'backdrop-blur-sm cursor-default bg-black/30': props.isBackDrop,
          hidden: !props.isBackDrop,
        })}
      />
      <div
        className={cn('transition-all relative z-50', props.className, {
          show: props.isShow,
          hide: !props.isShow,
        })}
      >
        <div className="container">
          <div className="rounded-md border border-gray-200 bg-white">
            <div className="absolute -top-10 right-2.5 flex p-1">
              <button
                onClick={() => {
                  props.onClose();
                }}
                className="flex size-8 items-center justify-center overflow-hidden rounded-lg bg-red-500"
              >
                <HiMiniXMark size={24} className="fill-white" />
              </button>
            </div>
            <div>{props.children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
