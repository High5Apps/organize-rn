import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo, useState,
} from 'react';
import { UserType } from './User';

export type UserContextType = {
  currentUser: UserType | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserType | undefined>>;
};

const UserContext = createContext<UserContextType>({
  currentUser: undefined,
  setCurrentUser: () => undefined,
});

export type UserContextProviderProps = {
  user?: UserType;
};

export function UserContextProvider({
  children, user,
}: PropsWithChildren<UserContextProviderProps>) {
  const [currentUser, setCurrentUser] = useState<UserType | undefined >(user);

  const userContext = useMemo<UserContextType>(() => ({
    currentUser, setCurrentUser,
  }), [currentUser, setCurrentUser]);

  return (
    <UserContext.Provider value={userContext}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.defaultProps = {
  user: undefined,
};

export const useUserContext = () => useContext(UserContext);
