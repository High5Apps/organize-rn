import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
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

function renderTestComponent({ initialCurrentUserData }: Props) {
  render((
    <CurrentUserDataContextProvider
      initialCurrentUserData={initialCurrentUserData}
    >
      <TestComponent />
    </CurrentUserDataContextProvider>
  ));
}

const defaultReturnValue = {
  storedCurrentUserData: null,
  initialized: false,
  setStoredCurrentUserData: jest.fn(),
};

describe('CurrentUserDataContext', () => {
  it('uses user prop to initialize useCurrentUser', () => {
    mockUseStoredCurrentUserData.mockReturnValue(defaultReturnValue);
    const initialCurrentUserData = fakeCurrentUserData;
    renderTestComponent({ initialCurrentUserData });
    expect(mockUseStoredCurrentUserData)
      .toHaveBeenCalledWith(initialCurrentUserData);
  });

  it('renders nothing until currentUser intialized', () => {
    mockUseStoredCurrentUserData.mockReturnValue({
      ...defaultReturnValue,
      initialized: false,
    });
    renderTestComponent({});
    expect(screen.queryByTestId(testID)).toBeNull();
  });

  it('renders children after currentUser initialized', () => {
    mockUseStoredCurrentUserData.mockReturnValue({
      ...defaultReturnValue,
      initialized: true,
    });
    renderTestComponent({});
    expect(screen.getByTestId(testID)).not.toBeNull();
  });

  describe('useCurrentUserDataContext', () => {
    it('contains storedUser from useStoredUser', () => {
      const storedCurrentUserData = fakeCurrentUserData;
      mockUseStoredCurrentUserData.mockReturnValue({
        ...defaultReturnValue,
        storedCurrentUserData,
        initialized: true,
      });
      renderTestComponent({});
      expect(screen.getByTestId(testID))
        .toHaveTextContent(storedCurrentUserData.id);
    });

    it('contains setStoredUser from useStoredUser', () => {
      mockUseStoredCurrentUserData.mockReturnValue({
        ...defaultReturnValue,
        initialized: true,
      });
      const mockSetStoredCurrentUserData = defaultReturnValue.setStoredCurrentUserData;
      expect(mockSetStoredCurrentUserData).not.toHaveBeenCalled();
      renderTestComponent({});
      expect(mockSetStoredCurrentUserData).toHaveBeenCalled();
    });
  });
});
