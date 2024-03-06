import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { DelayedActivityIndicator } from '../../app/components';
import { CurrentUserData } from '../../app/model';
import { fakeCurrentUserData, fakeOtherCurrentUserData } from '../FakeData';
import {
  UserContextProvider, useUserContext,
} from '../../app/context/UserContext';
import useStoredCurrentUserData from '../../app/model/CurrentUserDataStorage';

jest.useFakeTimers();

jest.mock('../../app/model/CurrentUserDataStorage');
const mockUseStoredCurrentUserData = useStoredCurrentUserData as jest.Mock;

const testID = 'currentUserId';

function TestComponent() {
  const { currentUserData, setCurrentUserData } = useUserContext();

  useEffect(() => {
    setCurrentUserData(fakeOtherCurrentUserData);
  }, []);

  return <Text testID={testID}>{currentUserData?.id}</Text>;
}

type Props = {
  initialCurrentUserData?: CurrentUserData;
};

async function renderTestComponent({ initialCurrentUserData }: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <UserContextProvider initialCurrentUserData={initialCurrentUserData}>
        <TestComponent />
      </UserContextProvider>
    ));
  });
  const root = renderer?.root;
  return { root };
}

const defaultReturnValue = {
  storedCurrentUserData: null,
  initialized: false,
  setStoredCurrentUserData: jest.fn(),
};

describe('UserContext', () => {
  it('uses user prop to initialize useCurrentUser', async () => {
    mockUseStoredCurrentUserData.mockReturnValue(defaultReturnValue);
    const initialCurrentUserData = fakeCurrentUserData;
    await renderTestComponent({ initialCurrentUserData });
    expect(mockUseStoredCurrentUserData).toBeCalledWith(initialCurrentUserData);
  });

  it('renders spinner until currentUser intialized', async () => {
    mockUseStoredCurrentUserData.mockReturnValue({
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
    mockUseStoredCurrentUserData.mockReturnValue({
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
    it('contains storedUser from useStoredUser', async () => {
      const storedCurrentUserData = fakeCurrentUserData;
      mockUseStoredCurrentUserData.mockReturnValue({
        ...defaultReturnValue,
        storedCurrentUserData,
        initialized: true,
      });
      const { root } = await renderTestComponent({});
      const storedUserId = root?.findByProps({ testID }).props.children;
      expect(storedUserId).toBe(storedCurrentUserData.id);
    });

    it('contains setStoredUser from useStoredUser', async () => {
      mockUseStoredCurrentUserData.mockReturnValue({
        ...defaultReturnValue,
        initialized: true,
      });
      const mockSetStoredCurrentUserData = defaultReturnValue.setStoredCurrentUserData;
      expect(mockSetStoredCurrentUserData).not.toBeCalled();
      await renderTestComponent({});
      expect(mockSetStoredCurrentUserData).toBeCalled();
    });
  });
});
