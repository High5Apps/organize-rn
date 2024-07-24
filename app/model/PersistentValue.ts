import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getErrorMessage } from './Errors';

type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export default function usePersistentValue<
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
      console.error(getErrorMessage(error));
    });
  }, []);

  function setCachedValue(value: T) {
    try {
      const stringifiedValue = JSON.stringify(value);
      AsyncStorage.setItem(key, stringifiedValue);
      setStoredValue(value);
    } catch (error) {
      console.error(getErrorMessage(error));
    }
  }

  return [storedValue, setCachedValue, ready] as const;
}
