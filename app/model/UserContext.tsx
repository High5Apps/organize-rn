import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo,
} from 'react';
import { StyleSheet } from 'react-native';
// The line below needs to import directly from DelayedActivityIndicator to
// prevent a circular dependency issue. Normally components import from models,
// not the other way around.
import DelayedActivityIndicator from '../components/views/DelayedActivityIndicator';
import useCurrentUser from './CurrentUser';
import type { StorableUser } from './User';

const useStyles = () => {
  const styles = StyleSheet.create({
    delayedActivityIndicator: {
      flex: 1,
    },
  });

  return { styles };
};

type UserContextType = {
  currentUser: StorableUser | null;
  logOut: () => Promise<void>;
  setCurrentUser: Dispatch<SetStateAction<StorableUser | null>>;
};

const UserContext = createContext<UserContextType>({
  currentUser: null,
  logOut: async () => {},
  setCurrentUser: () => {},
});

type Props = {
  user?: StorableUser;
};

export function UserContextProvider({
  children, user,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();
  const {
    currentUser, initialized, logOut, setCurrentUser,
  } = useCurrentUser(user);

  const userContext = useMemo<UserContextType>(() => ({
    currentUser, logOut, setCurrentUser,
  }), [currentUser, setCurrentUser]);

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
