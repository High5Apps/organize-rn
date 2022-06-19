import AsyncStorage from '@react-native-async-storage/async-storage';
import { isUserData, UserData } from './types';
import User, { UserType } from './User';

const STORAGE_KEY = 'currentUser';

export async function getStoredUser(): Promise<UserType | null> {
  let storedData = null;
  try {
    storedData = await AsyncStorage.getItem(STORAGE_KEY);
  } catch (e) {
    console.warn(`Error while accessing stored user data: ${e}`);
  }

  if (storedData === null) {
    return null;
  }

  let userData;
  try {
    userData = JSON.parse(storedData);
  } catch (e) {
    console.warn(`Error parsing stored user data: ${e}`);
  }

  if (!isUserData(userData)) {
    const json = JSON.stringify(userData, null, 2);
    console.warn(`Stored user data is invalid: ${json}`);
    return null;
  }

  return User(userData);
}

export async function setStoredUser(user: UserType | null) {
  let userData: UserData | null = null;
  if (user) {
    const { id, orgId } = user;
    userData = { id, orgId };
  }
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}
