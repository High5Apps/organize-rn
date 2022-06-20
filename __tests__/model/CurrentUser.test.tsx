import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { useCurrentUser } from '../../app/model';
import User, { UserType } from '../../app/model/User';
import { getStoredUser, setStoredUser } from '../../app/model/UserStorage';

jest.mock('../../app/model/UserStorage');
const mockGetStoredUser = getStoredUser as jest.Mock;
const mockSetStoredUser = setStoredUser as jest.Mock;

const currentUserTestId = 'currentUserTestId';
const intializedTestId = 'intializedTestId';
const fakeCurrentUserId = 'fakeCurrentUserId';
const otherFakeCurrentUserId = 'otherFakeCurrentUserId';
const orgId = 'fakeOrgId';
const fakeUser = User({ id: fakeCurrentUserId, orgId });
const otherFakeUser = User({ id: otherFakeCurrentUserId, orgId });

type Props = {
  user?: UserType;
  newUser?: UserType;
};

function TestComponent({ newUser, user }: Props) {
  const { currentUser, initialized, setCurrentUser } = useCurrentUser(user);

  useEffect(() => {
    expect(initialized).toBeFalsy();
  }, []);

  useEffect(() => {
    if (newUser) {
      setCurrentUser(newUser);
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
  user: undefined,
  newUser: undefined,
};

async function renderTestComponent({ newUser, user }: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <TestComponent newUser={newUser} user={user} />
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
        newUser: otherFakeUser,
      });
      expect(currentUserId).toBe(otherFakeUser.id);
    });

    it('updates storedUser', async () => {
      await renderTestComponent({
        user: fakeUser,
        newUser: otherFakeUser,
      });
      expect(mockSetStoredUser).toHaveBeenNthCalledWith(1, fakeUser);
      expect(mockSetStoredUser).toHaveBeenNthCalledWith(2, otherFakeUser);
    });
  });
});
