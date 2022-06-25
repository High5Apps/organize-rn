import AsyncStorage from '@react-native-async-storage/async-storage';
import { isCurrentUserData } from './types';
import User, { UserType } from './User';

const STORAGE_KEY = 'currentUser';

export async function getStoredUser(): Promise<UserType | null> {
  let storedData = null;
  try {
    storedData = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn(`Error while accessing stored user data: ${e}`);
  }

  if (!storedData) { return null; }

  let userData;
  try {
    userData = JSON.parse(storedData);
  } catch (e) {
    console.warn(`Error parsing stored user data: ${e}`);
  }

  if (!userData) { return null; }

  if (!isCurrentUserData(userData)) {
    const json = JSON.stringify(userData, null, 2);
    console.warn(`Stored user data is invalid: ${json}`);
    return null;
  }

  return User(userData);
}

export async function setStoredUser(user: UserType | null) {
  if (user && !isCurrentUserData(user)) {
    const json = JSON.stringify(user, null, 2);
    console.warn(`Attempted to store invalid current user data: ${json}`);
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
