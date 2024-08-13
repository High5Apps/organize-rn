import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { User } from '../../types';
import useModelCache from '../../ModelCache';

type UserContextType = {
  cacheUser: (user: User) => void;
  cacheUsers: (users?: User[]) => void;
  getCachedUser: (id?: string) => User | undefined;
};

const UserContext = createContext<UserContextType>({
  cacheUser: () => {},
  cacheUsers: () => {},
  getCachedUser: () => undefined,
});

export function UserContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheUser,
    cacheModels: cacheUsers,
    getCachedModel: getCachedUser,
  } = useModelCache<User>();

  const userContext = useMemo<UserContextType>(() => ({
    cacheUser, cacheUsers, getCachedUser,
  }), [cacheUser, cacheUsers, getCachedUser]);

  return (
    <UserContext.Provider value={userContext}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
