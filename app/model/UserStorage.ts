import AsyncStorage from '@react-native-async-storage/async-storage';
import { isCurrentUserData } from './types';
import User, { UserType } from './User';

const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
const STORAGE_KEY = 'currentUser';

function replacer(_: string, value: any) {
  return (value instanceof Date) ? value.toISOString() : value;
}

function toJson(value: any, space?: number) {
  return JSON.stringify(value, replacer, space);
}

function reviver(_: string, value: any) {
  return (typeof value === 'string' && ISO_8601_REGEX.test(value))
    ? new Date(value) : value;
}

function fromJson(text: string): any {
  return JSON.parse(text, reviver);
}

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
    userData = fromJson(storedData);
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

export async function setStoredUser(user: UserType | null) {
  if (user && !isCurrentUserData(user)) {
    const json = toJson(user, 2);
    console.warn(`Attempted to store invalid current user data: ${json}`);
    return;
  }

  await AsyncStorage.setItem(STORAGE_KEY, toJson(user));
}
