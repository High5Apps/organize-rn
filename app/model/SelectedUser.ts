import { useEffect, useState } from 'react';
import { User } from './types';
import useCurrentUser from './CurrentUser';
import { getUser } from '../networking';
import { useUserContext } from '../context';
import usePreviousValue from './PreviousValue';

export default function useSelectedUser() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const previousSelectedUserId = usePreviousValue(selectedUserId);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const { currentUser } = useCurrentUser();
  const { cacheUser, getCachedUser } = useUserContext();

  useEffect(() => {
    let subscribed = true;
    const unsubscribe = () => { subscribed = false; };

    async function fetchSelectedUser() {
      if (!currentUser) { return; }
      if (selectedUserId === previousSelectedUserId) { return; }

      setSelectedUser(undefined);

      if (!selectedUserId) { return; }

      const cachedUser = getCachedUser(selectedUserId);
      if (cachedUser) {
        setSelectedUser(cachedUser);
      }

      const jwt = await currentUser.createAuthToken({ scope: '*' });
      const { errorMessage, user } = await getUser({ id: selectedUserId, jwt });

      if (!subscribed) { return; }

      if (errorMessage !== undefined) {
        throw new Error(errorMessage);
      }

      setSelectedUser(user);
      cacheUser(user);
    }

    fetchSelectedUser().catch(console.error);

    return unsubscribe;
  }, [currentUser, getCachedUser, selectedUserId]);

  return { selectedUser, setSelectedUserId };
}
