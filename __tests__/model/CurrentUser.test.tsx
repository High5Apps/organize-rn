import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import useCurrentUser from '../../app/model/CurrentUser';
import User from '../../app/model/User';
import useStoredUser, { storeUser } from '../../app/model/StoredUser';
import { fakeCurrentUser } from '../FakeData';
import { CurrentUserData } from '../../app/model';

jest.mock('../../app/model/StoredUser');
const mockUseStoredUser = useStoredUser as jest.Mock;
const mockSetStoredUser = jest.fn();
const mockStoreUser = storeUser as jest.Mock;
const defaultReturn = {
  initialized: false,
  setStoredUser: mockSetStoredUser,
  storedUser: fakeCurrentUser,
};

jest.mock('../../app/model/User');
const mockUser = User as jest.Mock;
const mockDeleteKeys = jest.fn();
mockUser.mockReturnValue({ ...fakeCurrentUser, deleteKeys: mockDeleteKeys });

const currentUserTestId = 'currentUserTestId';

type Props = {
  shouldLogOut?: boolean;
  user?: CurrentUserData;
};

function TestComponent({ shouldLogOut, user }: Props) {
  const { currentUser, logOut } = useCurrentUser(user);

  useEffect(() => {
    if (shouldLogOut) {
      logOut();
    }
  }, []);

  return <Text testID={currentUserTestId}>{currentUser?.id}</Text>;
}

TestComponent.defaultProps = {
  shouldLogOut: false,
  user: undefined,
};

async function renderTestComponent({ shouldLogOut, user }: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <TestComponent shouldLogOut={shouldLogOut} user={user} />
    ));
  });
  const root = renderer?.root;
  function findByTestId(testID: string) {
    return root?.findByProps({ testID }).props.children;
  }
  const currentUserId = findByTestId(currentUserTestId);
  return { currentUserId };
}

describe('useCurrentUser', () => {
  describe('logOut', () => {
    beforeEach(async () => {
      mockUseStoredUser.mockReturnValue(defaultReturn);
      await renderTestComponent({ shouldLogOut: true, user: fakeCurrentUser });
    });

    it('should delete keys', () => {
      expect(mockDeleteKeys).toBeCalled();
    });

    it('should clear storedUser', () => {
      expect(mockSetStoredUser).toBeCalledWith(null);
    });

    it('should store null user', () => {
      expect(mockStoreUser).toBeCalledWith(null);
    });
  });
});
