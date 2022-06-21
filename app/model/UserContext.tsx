import React, {
  createContext, Dispatch, PropsWithChildren, SetStateAction, useContext,
  useMemo,
} from 'react';
import { StyleSheet } from 'react-native';
import { DelayedActivityIndicator } from '../components';
import useCurrentUser from './CurrentUser';
import { UserType } from './User';

const useStyles = () => {
  const styles = StyleSheet.create({
    delayedActivityIndicator: {
      flex: 1,
    },
  });

  return { styles };
};

type UserContextType = {
  currentUser: UserType | null;
  setCurrentUser: Dispatch<SetStateAction<UserType | null>>;
};

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

type Props = {
  user?: UserType;
};

export function UserContextProvider({
  children, user,
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();
  const { currentUser, initialized, setCurrentUser } = useCurrentUser(user);

  const userContext = useMemo<UserContextType>(() => ({
    currentUser, setCurrentUser,
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
