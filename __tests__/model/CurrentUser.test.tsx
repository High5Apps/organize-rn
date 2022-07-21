import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { useCurrentUser } from '../../app/model';
import { UserType } from '../../app/model/User';
import { getStoredUser, setStoredUser } from '../../app/model/UserStorage';
import { fakeOtherUser, fakeUser } from '../FakeData';

jest.mock('../../app/model/UserStorage');
const mockGetStoredUser = getStoredUser as jest.Mock;
const mockSetStoredUser = setStoredUser as jest.Mock;

const currentUserTestId = 'currentUserTestId';
const intializedTestId = 'intializedTestId';

type Props = {
  newUser?: UserType | null;
  shouldLogOut?: boolean;
  user?: UserType;
};

function TestComponent({ newUser, shouldLogOut, user }: Props) {
  const {
    currentUser, initialized, logOut, setCurrentUser,
  } = useCurrentUser(user);

  useEffect(() => {
    expect(initialized).toBeFalsy();
  }, []);

  useEffect(() => {
    if (newUser !== undefined) {
      setCurrentUser(newUser);
    }
  }, []);

  useEffect(() => {
    if (shouldLogOut) {
      logOut();
    }
  }, []);

  return (
    <>
      <Text testID={currentUserTestId}>{currentUser?.id}</Text>
      <Text testID={intializedTestId}>{initialized}</Text>
    </>
  );
}

TestComponent.defaultProps = {
  newUser: undefined,
  shouldLogOut: false,
  user: undefined,
};

async function renderTestComponent({ newUser, shouldLogOut, user }: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <TestComponent
        newUser={newUser}
        shouldLogOut={shouldLogOut}
        user={user}
      />
    ));
  });
  const root = renderer?.root;
  function findByTestId(testID: string) {
    return root?.findByProps({ testID }).props.children;
  }
  const currentUserId = findByTestId(currentUserTestId);
  const initialized = findByTestId(intializedTestId);
  return { currentUserId, initialized };
}

describe('useCurrentUser', () => {
  describe('initialized', () => {
    it('is true after currentUser is initialized', async () => {
      const { initialized } = await renderTestComponent({});
      expect(initialized).toBeTruthy();
    });
  });

  describe('currentUser', () => {
    it('is initialized by prop when present', async () => {
      const { currentUserId } = await renderTestComponent({ user: fakeUser });
      expect(currentUserId).toBe(fakeUser.id);
    });

    it('is initialized by getStoredUser when prop absent', async () => {
      mockGetStoredUser.mockResolvedValue(fakeUser);
      const { currentUserId } = await renderTestComponent({});
      expect(currentUserId).toBe(fakeUser.id);
    });

    it('is initially falsy when prop absent and no storedUser', async () => {
      mockGetStoredUser.mockResolvedValue(null);
      const { currentUserId } = await renderTestComponent({});
      expect(currentUserId).toBeFalsy();
    });
  });

  describe('setCurrentUser', () => {
    it('updates currentUser', async () => {
      const { currentUserId } = await renderTestComponent({
        user: fakeUser,
        newUser: fakeOtherUser,
      });
      expect(currentUserId).toBe(fakeOtherUser.id);
    });

    it('updates storedUser', async () => {
      await renderTestComponent({
        user: fakeUser,
        newUser: fakeOtherUser,
      });
      expect(mockSetStoredUser).toHaveBeenNthCalledWith(1, fakeUser);
      expect(mockSetStoredUser).toHaveBeenNthCalledWith(2, fakeOtherUser);
    });

    it('should not clear stored user', async () => {
      await renderTestComponent({
        user: fakeUser,
        newUser: null,
      });
      expect(mockSetStoredUser).not.toBeCalledWith(null);
    });
  });

  describe('logOut', () => {
    const mockDeleteKeyPair = jest.fn();
    let currentUserId: string;
    beforeEach(async () => {
      const user = { ...fakeUser, deleteKeyPair: mockDeleteKeyPair };
      const result = await renderTestComponent({ shouldLogOut: true, user });
      currentUserId = result.currentUserId;
    });

    it('should delete key pair', () => {
      expect(mockDeleteKeyPair).toBeCalled();
    });

    it('should clear storedUser', () => {
      expect(mockSetStoredUser).toBeCalledWith(null);
    });

    it('should clear currentUser', () => {
      expect(currentUserId).toBeFalsy();
    });
  });
});
