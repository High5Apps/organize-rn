import AsyncStorage from '@react-native-async-storage/async-storage';
import { isCurrentUserData } from './types';
import User, { StorableUser } from './User';
import { fromJson, toJson } from './Json';

const STORAGE_KEY = 'currentUser';

export async function getStoredUser(): Promise<StorableUser | null> {
  let storedData = null;
  try {
    storedData = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn(`Error while accessing stored user data: ${e}`);
  }

  if (!storedData) { return null; }

  let userData;
  try {
    userData = fromJson(storedData, { convertIso8601ToDate: true });
  } catch (e) {
    console.warn(`Error parsing stored user data: ${e}`);
  }

  if (!userData) { return null; }

  if (!isCurrentUserData(userData)) {
    const json = toJson(userData, 2);
    console.warn(`Stored user data is invalid: ${json}`);
    return null;
  }

  return User(userData);
}

export async function setStoredUser(user: StorableUser | null) {
  if (user && !isCurrentUserData(user)) {
    const json = toJson(user, 2);
    console.warn(`Attempted to store invalid current user data: ${json}`);
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEY, toJson(user));
}
