import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo,
} from 'react';
// The line below needs to import directly from DelayedActivityIndicator to
// prevent a circular dependency issue. Normally components import from models,
// which import from context, not the other way around.
import DelayedActivityIndicator from '../components/views/DelayedActivityIndicator';
import type { CurrentUserData } from '../model';
import useStoredCurrentUserData from '../model/CurrentUserDataStorage';

type UserContextType = {
  currentUserData: CurrentUserData | null;
  setCurrentUserData: Dispatch<SetStateAction<CurrentUserData | null>>;
};

const UserContext = createContext<UserContextType>({
  currentUserData: null,
  setCurrentUserData: () => {},
});

type Props = {
  initialCurrentUserData?: CurrentUserData;
};

export function UserContextProvider({
  children, initialCurrentUserData,
}: PropsWithChildren<Props>) {
  const {
    initialized, storedCurrentUserData, setStoredCurrentUserData,
  } = useStoredCurrentUserData(initialCurrentUserData);

  const userContext = useMemo<UserContextType>(() => ({
    currentUserData: storedCurrentUserData,
    setCurrentUserData: setStoredCurrentUserData,
  }), [storedCurrentUserData, setStoredCurrentUserData]);

  return (
    <UserContext.Provider value={userContext}>
      {initialized ? children : <DelayedActivityIndicator delay={1000} />}
    </UserContext.Provider>
  );
}

UserContextProvider.defaultProps = {
  initialCurrentUserData: undefined,
};

export const useUserContext = () => useContext(UserContext);
