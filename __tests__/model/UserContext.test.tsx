import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { DelayedActivityIndicator } from '../../app/components';
import { User, UserContextProvider, useUserContext } from '../../app/model';
import useCurrentUser from '../../app/model/CurrentUser';
import { UserType } from '../../app/model/User';

jest.useFakeTimers();
jest.mock('../../app/model/CurrentUser');
const mockUseCurrentUser = useCurrentUser as jest.Mock;

const testID = 'currentUserId';
const fakeCurrentUserId = 'fakeCurrentUserId';
const otherFakeCurrentUserId = 'otherFakeCurrentUserId';
const orgId = 'fakeOrgId';
const fakeUser = User({ id: fakeCurrentUserId, orgId });
const otherFakeUser = User({ id: otherFakeCurrentUserId, orgId });

function TestComponent() {
  const { currentUser, setCurrentUser } = useUserContext();

  useEffect(() => {
    setCurrentUser(otherFakeUser);
  }, []);

  return <Text testID={testID}>{currentUser?.id}</Text>;
}

type Props = {
  user?: UserType;
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
  currentUser: null,
  initialized: false,
  setCurrentUser: jest.fn(),
};

describe('UserContext', () => {
  it('uses user prop to initialize useCurrentUser', async () => {
    mockUseCurrentUser.mockReturnValue(defaultReturnValue);
    await renderTestComponent({ user: fakeUser });
    expect(mockUseCurrentUser).toBeCalledWith(fakeUser);
  });

  it('renders spinner until currentUser intialized', async () => {
    mockUseCurrentUser.mockReturnValue({
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
    mockUseCurrentUser.mockReturnValue({
      ...defaultReturnValue,
      initialized: true,
    });
    const { root } = await renderTestComponent({});
    const spinner = root?.findAllByType(DelayedActivityIndicator);
    expect(spinner?.length).toBeFalsy();
    const children = root?.findByType(TestComponent);
    expect(children).toBeTruthy();
  });

  describe('userContext', () => {
    it('contains currentUser from useCurrentUser', async () => {
      mockUseCurrentUser.mockReturnValue({
        ...defaultReturnValue,
        currentUser: fakeUser,
        initialized: true,
      });
      const { root } = await renderTestComponent({});
      const currentUserId = root?.findByProps({ testID }).props.children;
      expect(currentUserId).toBe(fakeUser.id);
    });

    it('contains setCurrentUser from useCurrentUser', async () => {
      mockUseCurrentUser.mockReturnValue({
        ...defaultReturnValue,
        initialized: true,
      });
      const mockSetCurrentUser = defaultReturnValue.setCurrentUser;
      expect(mockSetCurrentUser).not.toBeCalled();
      await renderTestComponent({});
      expect(mockSetCurrentUser).toBeCalled();
    });
  });
});
