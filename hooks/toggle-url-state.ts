import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useToggleUrlState(key: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const prefixedKey = `toggle-${key}`;
  const [state, setState] = useState(searchParams.has(prefixedKey));

  useEffect(() => {
    setState(searchParams.has(prefixedKey));
  }, [searchParams, prefixedKey]);

  const updateUrl = async (
    newState: boolean,
    additionalParams?: Record<string, string>,
    keysToRemove?: string[],
  ) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());

    Array.from(updatedSearchParams.keys()).forEach((paramKey) => {
      if (paramKey.startsWith('toggle-')) {
        updatedSearchParams.delete(paramKey);
      }
    });

    if (keysToRemove) {
      keysToRemove.forEach((key) => {
        updatedSearchParams.delete(key);
      });
    }

    if (newState) {
      updatedSearchParams.set(prefixedKey, 'true');
    }

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        updatedSearchParams.set(key, value);
      });
    }

    router.push(`${pathname}?${updatedSearchParams.toString()}`, {
      scroll: false,
    });

    setState(newState);
  };

  return {
    isShow: state,
    toggle: () => updateUrl(!state),
    hide: (keysToRemove?: string[]) =>
      updateUrl(false, undefined, keysToRemove),
    show: (additionalParams?: Record<string, string>) =>
      updateUrl(true, additionalParams),
  };
}
