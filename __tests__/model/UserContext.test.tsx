import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { DelayedActivityIndicator } from '../../app/components';
import { CurrentUserData, UserContextProvider } from '../../app/model';
import { fakeCurrentUser, fakeOtherCurrentUser } from '../FakeData';
import { useUserContext } from '../../app/model/UserContext';
import useStoredUser from '../../app/model/StoredUser';

jest.useFakeTimers();

jest.mock('../../app/model/StoredUser');
const mockUseStoredUser = useStoredUser as jest.Mock;

const testID = 'currentUserId';

function TestComponent() {
  const { currentUserData, setCurrentUserData } = useUserContext();

  useEffect(() => {
    setCurrentUserData(fakeOtherCurrentUser);
  }, []);

  return <Text testID={testID}>{currentUserData?.id}</Text>;
}

type Props = {
  user?: CurrentUserData;
};

async function renderTestComponent({ user }: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <UserContextProvider user={user}>
        <TestComponent />
      </UserContextProvider>
    ));
  });
  const root = renderer?.root;
  return { root };
}

const defaultReturnValue = {
  storedUser: null,
  initialized: false,
  setStoredUser: jest.fn(),
};

describe('UserContext', () => {
  it('uses user prop to initialize useCurrentUser', async () => {
    mockUseStoredUser.mockReturnValue(defaultReturnValue);
    await renderTestComponent({ user: fakeCurrentUser });
    expect(mockUseStoredUser).toBeCalledWith(fakeCurrentUser);
  });

  it('renders spinner until currentUser intialized', async () => {
    mockUseStoredUser.mockReturnValue({
      ...defaultReturnValue,
      initialized: false,
    });
    const { root } = await renderTestComponent({});
    const spinner = root?.findByType(DelayedActivityIndicator);
    expect(spinner).toBeTruthy();
    const children = root?.findAllByType(TestComponent);
    expect(children?.length).toBeFalsy();
  });

  it('renders children after currentUser initialized', async () => {
    mockUseStoredUser.mockReturnValue({
      ...defaultReturnValue,
      currentUser: fakeCurrentUser,
      initialized: true,
    });
    const { root } = await renderTestComponent({});
    const spinner = root?.findAllByType(DelayedActivityIndicator);
    expect(spinner?.length).toBeFalsy();
    const children = root?.findByType(TestComponent);
    expect(children).toBeTruthy();
  });

  describe('userContext', () => {
    it('contains storedUser from useStoredUser', async () => {
      const storedUser = fakeCurrentUser;
      mockUseStoredUser.mockReturnValue({
        ...defaultReturnValue,
        storedUser,
        initialized: true,
      });
      const { root } = await renderTestComponent({});
      const storedUserId = root?.findByProps({ testID }).props.children;
      expect(storedUserId).toBe(storedUser.id);
    });

    it('contains setStoredUser from useStoredUser', async () => {
      mockUseStoredUser.mockReturnValue({
        ...defaultReturnValue,
        initialized: true,
      });
      const mockSetCurrentUser = defaultReturnValue.setStoredUser;
      expect(mockSetCurrentUser).not.toBeCalled();
      await renderTestComponent({});
      expect(mockSetCurrentUser).toBeCalled();
    });
  });
});
