import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import { CurrentUserData } from '../../../app/model';
import { fakeCurrentUserData, fakeOtherCurrentUserData } from '../../FakeData';
import {
  CurrentUserDataContextProvider, useCurrentUserDataContext,
} from '../../../app/model/context/providers/CurrentUserDataContext';
import useStoredCurrentUserData from '../../../app/model/context/providers/caches/CurrentUserDataStorage';

jest.useFakeTimers();

jest.mock('../../../app/model/context/providers/caches/CurrentUserDataStorage');
const mockUseStoredCurrentUserData = useStoredCurrentUserData as jest.Mock;

const testID = 'currentUserId';

function TestComponent() {
  const { currentUserData, setCurrentUserData } = useCurrentUserDataContext();

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
      <CurrentUserDataContextProvider
        initialCurrentUserData={initialCurrentUserData}
      >
        <TestComponent />
      </CurrentUserDataContextProvider>
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

describe('CurrentUserDataContext', () => {
  it('uses user prop to initialize useCurrentUser', async () => {
    mockUseStoredCurrentUserData.mockReturnValue(defaultReturnValue);
    const initialCurrentUserData = fakeCurrentUserData;
    await renderTestComponent({ initialCurrentUserData });
    expect(mockUseStoredCurrentUserData).toBeCalledWith(initialCurrentUserData);
  });

  it('renders nothing until currentUser intialized', async () => {
    mockUseStoredCurrentUserData.mockReturnValue({
      ...defaultReturnValue,
      initialized: false,
    });
    const { root } = await renderTestComponent({});
    expect(root?.children).toHaveLength(0);
    const children = root?.findAllByType(TestComponent);
    expect(children?.length).toBeFalsy();
  });

  it('renders children after currentUser initialized', async () => {
    mockUseStoredCurrentUserData.mockReturnValue({
      ...defaultReturnValue,
      initialized: true,
    });
    const { root } = await renderTestComponent({});
    expect(root?.children).not.toHaveLength(0);
    const children = root?.findByType(TestComponent);
    expect(children).toBeTruthy();
  });

  describe('useCurrentUserDataContext', () => {
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
