import useStoredUser, { storeUser } from './StoredUser';
import User from './User';
import { CurrentUserData } from './types';

export default function useCurrentUser(user: CurrentUserData | null = null) {
  const {
    initialized,
    storedUser,
    setStoredUser: setCurrentUser,
  } = useStoredUser(user);

  const currentUser = storedUser && User(storedUser);

  const logOut = async () => {
    await currentUser?.deleteKeys();
    storeUser(null);
    setCurrentUser(null);
  };

  return {
    currentUser, initialized, logOut, setCurrentUser,
  };
}
