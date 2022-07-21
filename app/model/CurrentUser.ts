import { useEffect, useState } from 'react';
import { UserType } from './User';
import { getStoredUser, setStoredUser } from './UserStorage';

export default function useCurrentUser(user: UserType | null = null) {
  const [
    currentUser, setCurrentUser,
  ] = useState<UserType | null >(user || null);
  const [initialized, setInitialized] = useState(false);

  const logOut = async () => {
    await currentUser?.deleteKeyPair();
    setStoredUser(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    async function initializeCurrentUser() {
      let storedUser = null;

      try {
        storedUser = await getStoredUser();
      } catch (e) {
        console.warn(e);
      }

      if (subscribed) {
        setCurrentUser(storedUser);
        setInitialized(true);
      }
    }

    if (!currentUser) {
      initializeCurrentUser();
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    // Don't want to accidentally delete the stored user
    if (currentUser) {
      setStoredUser(currentUser);
    }
  }, [currentUser]);

  return {
    currentUser, initialized, logOut, setCurrentUser,
  };
}
