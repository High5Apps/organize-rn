import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo,
} from 'react';
// The line below needs to import directly from DelayedActivityIndicator to
// prevent a circular dependency issue. Normally components import from models,
// which import from context, not the other way around.
import DelayedActivityIndicator from '../components/views/DelayedActivityIndicator';
import type { CurrentUserData } from '../model';
import useStoredUser from '../model/StoredUser';

type UserContextType = {
  currentUserData: CurrentUserData | null;
  setCurrentUserData: Dispatch<SetStateAction<CurrentUserData | null>>;
};

const UserContext = createContext<UserContextType>({
  currentUserData: null,
  setCurrentUserData: () => {},
});

type Props = {
  user?: CurrentUserData;
};

export function UserContextProvider({
  children, user,
}: PropsWithChildren<Props>) {
  const { initialized, storedUser, setStoredUser } = useStoredUser(user);

  const userContext = useMemo<UserContextType>(() => ({
    currentUserData: storedUser, setCurrentUserData: setStoredUser,
  }), [storedUser, setStoredUser]);

  return (
    <UserContext.Provider value={userContext}>
      {initialized ? children : <DelayedActivityIndicator delay={1000} />}
    </UserContext.Provider>
  );
}

UserContextProvider.defaultProps = {
  user: undefined,
};

export const useUserContext = () => useContext(UserContext);
