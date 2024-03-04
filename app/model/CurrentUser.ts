import { StorableUser } from './User';
import useStoredUser, { storeUser } from './UserStorage';

export default function useCurrentUser(user: StorableUser | null = null) {
  const {
    initialized,
    storedUser: currentUser,
    setStoredUser: setCurrentUser,
  } = useStoredUser(user);

  const logOut = async () => {
    await currentUser?.deleteKeys();
    storeUser(null);
    setCurrentUser(null);
  };

  return {
    currentUser, initialized, logOut, setCurrentUser,
  };
}
