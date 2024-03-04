import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import { isCurrentUserData } from '../../app/model';
import useStoredUser, {
  getStoredUser, storeUser,
} from '../../app/model/UserStorage';
import { fakeCurrentUser, fakeOtherCurrentUser, fakeUser } from '../FakeData';
import { StorableUser } from '../../app/model/User';

describe('UserStorage', () => {
  beforeEach(async () => {
    await storeUser(null);
    const storedUser = await getStoredUser();
    expect(storedUser).toBeNull();
    expect(isCurrentUserData(fakeCurrentUser)).toBeTruthy();
    expect(isCurrentUserData(fakeOtherCurrentUser)).toBeTruthy();
  });

  describe('getStoredUser', () => {
    it('returns the last user stored with storeUser', async () => {
      await storeUser(fakeCurrentUser);
      let storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeCurrentUser)).toBeTruthy();

      await storeUser(fakeOtherCurrentUser);
      storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeOtherCurrentUser)).toBeTruthy();
    });
  });

  describe('storeUser', () => {
    it('should store valid user data', async () => {
      await storeUser(fakeOtherCurrentUser);
      const storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeOtherCurrentUser)).toBeTruthy();
    });

    it('should store null user data', async () => {
      await storeUser(fakeOtherCurrentUser);
      let storedUser = await getStoredUser();
      expect(storedUser).toBeTruthy();

      await storeUser(null);
      storedUser = await getStoredUser();
      expect(storedUser).toBeNull();
    });

    it('should not store invalid user data', async () => {
      jest.spyOn(console, 'warn').mockImplementation();
      expect(isCurrentUserData(fakeUser)).toBeFalsy();
      storeUser(fakeUser);
      const storedUser = await getStoredUser();
      expect(storedUser?.equals(fakeUser)).toBeFalsy();
    });
  });
});

const storedUserTestId = 'storedUserTestId';
const intializedTestId = 'intializedTestId';

type Props = {
  newUser?: StorableUser | null;
  user?: StorableUser;
};

function TestComponent({ newUser, user }: Props) {
  const {
    setStoredUser, storedUser, initialized,
  } = useStoredUser(user);

  useEffect(() => {
    expect(initialized).toBeFalsy();
  }, []);

  useEffect(() => {
    if (newUser !== undefined) {
      setStoredUser(newUser);
    }
  }, []);

  return (
    <>
      <Text testID={storedUserTestId}>{storedUser?.id}</Text>
      <Text testID={intializedTestId}>{initialized}</Text>
    </>
  );
}

TestComponent.defaultProps = {
  newUser: undefined,
  user: undefined,
};

async function renderTestComponent({ newUser, user }: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create(<TestComponent newUser={newUser} user={user} />);
  });
  const root = renderer?.root;
  function findByTestId(testID: string) {
    return root?.findByProps({ testID }).props.children;
  }
  const storedUserId = findByTestId(storedUserTestId);
  const initialized = findByTestId(intializedTestId);
  return { storedUserId, initialized };
}

describe('useStoredUser', () => {
  afterEach(async () => {
    await storeUser(null);
  });
  describe('initialized', () => {
    it('is true after storedUser is initialized', async () => {
      const { initialized } = await renderTestComponent({});
      expect(initialized).toBeTruthy();
    });
  });

  describe('storedUser', () => {
    it('is initialized by prop when present', async () => {
      const { storedUserId } = await renderTestComponent({ user: fakeCurrentUser });
      expect(storedUserId).toBe(fakeCurrentUser.id);
    });

    it('is initialized by getStoredUser when prop absent', async () => {
      await storeUser(fakeCurrentUser);
      const { storedUserId } = await renderTestComponent({});
      expect(storedUserId).toBe(fakeCurrentUser.id);
    });

    it('is initially falsy when prop absent and no storedUser', async () => {
      const { storedUserId } = await renderTestComponent({});
      expect(storedUserId).toBeFalsy();
    });
  });

  describe('setStoredUser', () => {
    it('updates storedUser', async () => {
      const { storedUserId } = await renderTestComponent({
        user: fakeCurrentUser,
        newUser: fakeOtherCurrentUser,
      });
      expect(storedUserId).toBe(fakeOtherCurrentUser.id);
    });

    it('should not clear stored user', async () => {
      await renderTestComponent({
        user: fakeCurrentUser,
        newUser: null,
      });
      const storedUser = await getStoredUser();
      expect(storedUser?.id).toBe(fakeCurrentUser.id);
    });
  });
});
