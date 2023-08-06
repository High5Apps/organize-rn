import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export default function useCachedValue<
  T extends JSONValue,
>(key: string, defaultValue?: T) {
  const [storedValue, setStoredValue] = useState<T | undefined>(defaultValue);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(key).then((result) => {
      const parsedValue = result ? JSON.parse(result) : result;
      setStoredValue(parsedValue);
      setReady(true);
    }).catch((error) => {
      if (error instanceof Error) {
        console.error(error.message);
      }
    });
  }, []);

  function setCachedValue(value: T) {
    try {
      const stringifiedValue = JSON.stringify(value);
      AsyncStorage.setItem(key, stringifiedValue);
      setStoredValue(value);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  return [storedValue, setCachedValue, ready] as const;
}
