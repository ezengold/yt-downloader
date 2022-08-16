import { useCallback, useEffect } from 'react';

export const useDebounce = (
  fn: (...args: any[]) => any,
  delay: number,
  deps: any[]
) => {
  const callback = useCallback(fn, deps);

  useEffect(() => {
    const handler = setTimeout(() => callback(), delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback]);
};
