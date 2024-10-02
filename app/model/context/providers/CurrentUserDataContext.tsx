import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo,
} from 'react';
import type { CurrentUserData } from '../../types';
import { useStoredCurrentUserData } from './caches';

type CurrentUserDataContextType = {
  currentUserData: CurrentUserData | null;
  setCurrentUserData: Dispatch<SetStateAction<CurrentUserData | null>>;
};

const CurrentUserDataContext = createContext<CurrentUserDataContextType>({
  currentUserData: null,
  setCurrentUserData: () => {},
});

type Props = {
  initialCurrentUserData?: CurrentUserData;
};

export function CurrentUserDataContextProvider({
  children, initialCurrentUserData,
}: PropsWithChildren<Props>) {
  const {
    initialized, storedCurrentUserData, setStoredCurrentUserData,
  } = useStoredCurrentUserData(initialCurrentUserData);

  const currentUserDataContext = useMemo<CurrentUserDataContextType>(() => ({
    currentUserData: storedCurrentUserData,
    setCurrentUserData: setStoredCurrentUserData,
  }), [storedCurrentUserData, setStoredCurrentUserData]);

  return (
    <CurrentUserDataContext.Provider value={currentUserDataContext}>
      {initialized ? children : null}
    </CurrentUserDataContext.Provider>
  );
}

export const useCurrentUserDataContext = () => useContext(
  CurrentUserDataContext,
);
