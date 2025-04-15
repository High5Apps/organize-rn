import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { User } from '../../types';
import { useModelCache } from './caches';

type UserContextType = {
  cacheUser: (user: User) => void;
  cacheUsers: (users?: User[]) => void;
  clearCachedUsers: () => void;
  getCachedUser: (id?: string) => User | undefined;
};

const UserContext = createContext<UserContextType>({
  cacheUser: () => {},
  cacheUsers: () => {},
  clearCachedUsers: () => {},
  getCachedUser: () => undefined,
});

export function UserContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheUser,
    cacheModels: cacheUsers,
    clearCachedModels: clearCachedUsers,
    getCachedModel: getCachedUser,
  } = useModelCache<User>();

  const userContext = useMemo<UserContextType>(() => ({
    cacheUser, cacheUsers, clearCachedUsers, getCachedUser,
  }), [cacheUser, cacheUsers, clearCachedUsers, getCachedUser]);

  return (
    <UserContext.Provider value={userContext}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
