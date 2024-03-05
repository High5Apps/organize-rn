import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo,
} from 'react';
import { StyleSheet } from 'react-native';
// The line below needs to import directly from DelayedActivityIndicator to
// prevent a circular dependency issue. Normally components import from models,
// not the other way around.
import DelayedActivityIndicator from '../components/views/DelayedActivityIndicator';
import { CurrentUserData } from './types';
import useStoredUser from './StoredUser';

const useStyles = () => {
  const styles = StyleSheet.create({
    delayedActivityIndicator: {
      flex: 1,
    },
  });

  return { styles };
};

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
  const { styles } = useStyles();
  const { initialized, storedUser, setStoredUser } = useStoredUser(user);

  const userContext = useMemo<UserContextType>(() => ({
    currentUserData: storedUser, setCurrentUserData: setStoredUser,
  }), [storedUser, setStoredUser]);

  return (
    <UserContext.Provider value={userContext}>
      {initialized ? children : (
        <DelayedActivityIndicator
          delay={1000}
          style={styles.delayedActivityIndicator}
        />
      )}
    </UserContext.Provider>
  );
}

UserContextProvider.defaultProps = {
  user: undefined,
};

export const useUserContext = () => useContext(UserContext);
