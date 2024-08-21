import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrentUserData, isCurrentUserData } from '../../../types';
import { fromJson, toJson } from '../../../../networking';

const STORAGE_KEY = 'currentUser';

export async function getStoredCurrentUserData(): Promise<CurrentUserData | null> {
  let previouslyStoredCurrentUserData = null;
  try {
    previouslyStoredCurrentUserData = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn(
      `Error while accessing previously stored current user data: ${e}`,
    );
  }

  if (!previouslyStoredCurrentUserData) { return null; }

  let storedCurrentUserData;
  try {
    storedCurrentUserData = fromJson(previouslyStoredCurrentUserData, {
      convertIso8601ToDate: true,
    });
  } catch (e) {
    console.warn(`Error parsing stored user data: ${e}`);
  }

  if (!storedCurrentUserData) { return null; }

  if (!isCurrentUserData(storedCurrentUserData)) {
    const json = toJson(storedCurrentUserData, { space: 2 });
    console.warn(`Stored user data is invalid: ${json}`);
    return null;
  }

  return storedCurrentUserData;
}

export async function storeCurrentUserData(
  initialCurrentUserData: CurrentUserData | null,
) {
  if (initialCurrentUserData && !isCurrentUserData(initialCurrentUserData)) {
    const json = toJson(initialCurrentUserData, { space: 2 });
    console.warn(`Attempted to store invalid current user data: ${json}`);
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEY, toJson(initialCurrentUserData));
}

export default function useStoredCurrentUserData(
  initialCurrentUserData: CurrentUserData | null = null,
) {
  const [
    storedCurrentUserData, setStoredCurrentUserData,
  ] = useState<CurrentUserData | null >(initialCurrentUserData || null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    async function initializeStoredCurrentUserData() {
      let previouslyStoredCurrentUserData = null;

      try {
        previouslyStoredCurrentUserData = await getStoredCurrentUserData();
      } catch (e) {
        console.warn(e);
      }

      if (subscribed) {
        setStoredCurrentUserData(previouslyStoredCurrentUserData);
        setInitialized(true);
      }
    }

    if (!storedCurrentUserData) {
      initializeStoredCurrentUserData();
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Don't want to accidentally delete the stored user. To intentionally
    // delete it, call storeCurrentUserData directly.
    if (storedCurrentUserData) {
      storeCurrentUserData(storedCurrentUserData);
    }
  }, [storedCurrentUserData]);

  return { initialized, storedCurrentUserData, setStoredCurrentUserData };
}
