import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo,
} from 'react';
// The line below needs to import directly from DelayedActivityIndicator to
// prevent a circular dependency issue. Normally components import from models,
// which import from context, not the other way around.
import DelayedActivityIndicator from '../../components/views/DelayedActivityIndicator';
import type { CurrentUserData } from '../types';
import useStoredCurrentUserData from '../CurrentUserDataStorage';

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
      {initialized ? children : <DelayedActivityIndicator delay={1000} />}
    </CurrentUserDataContext.Provider>
  );
}

CurrentUserDataContextProvider.defaultProps = {
  initialCurrentUserData: undefined,
};

export const useCurrentUserDataContext = () => useContext(
  CurrentUserDataContext,
);