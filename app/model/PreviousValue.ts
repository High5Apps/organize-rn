import { useEffect, useRef } from 'react';

// https://stackoverflow.com/a/57706747/2421313
export default function usePreviousValue<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
