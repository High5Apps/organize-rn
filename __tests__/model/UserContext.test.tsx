import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { User, UserContextProvider, useUserContext } from '../../app/model';
import { UserType } from '../../app/model/User';

const testID = 'currentUserId';
const fakeCurrentUserId = 'fakeCurrentUserId';
const otherFakeCurrentUserId = 'otherFakeCurrentUserId';
const orgId = 'fakeOrgId';
const fakeUser = User({ id: fakeCurrentUserId, orgId });
const fakeUser2 = User({ id: otherFakeCurrentUserId, orgId });

function TestConsumerReader() {
  const { currentUser } = useUserContext();

  return (
    <Text testID={testID}>
      {currentUser?.id}
    </Text>
  );
}

type TestConsumerWriterProps = {
  children: JSX.Element;
  user?: UserType;
};

function TestConsumerWriter({ children, user }: TestConsumerWriterProps) {
  const { setCurrentUser } = useUserContext();

  useEffect(() => {
    if (!user) { return; }
    setCurrentUser(user);
  }, [user]);

  return children;
}

type TestProviderProps = {
  initialUser?: UserType;
  newUser?: UserType;
};

function createTestProvider({ initialUser, newUser }: TestProviderProps) {
  let renderer: ReactTestRenderer | undefined;
  act(() => {
    renderer = create((
      <UserContextProvider user={initialUser}>
        <TestConsumerWriter user={newUser}>
          <TestConsumerReader />
        </TestConsumerWriter>
      </UserContextProvider>
    ));
  });
  const root = renderer?.root;
  const currentUserId = root?.findByProps({ testID }).props.children;
  return currentUserId;
}

describe('UserContext', () => {
  describe('currentUser', () => {
    it('is initially undefined', async () => {
      const currentUserId = createTestProvider({});
      expect(currentUserId).toBeUndefined();
    });

    it('uses prop as initial value', () => {
      const currentUserId = createTestProvider({ initialUser: fakeUser });
      expect(currentUserId).toBe(fakeUser.id);
    });
  });

  describe('setCurrentUser', () => {
    it('updates currentUser', () => {
      const currentUserId = createTestProvider({
        initialUser: fakeUser,
        newUser: fakeUser2,
      });
      expect(currentUserId).toBe(fakeUser2.id);
    });
  });
});
