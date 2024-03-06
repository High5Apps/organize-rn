import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import { CurrentUserData, isCurrentUserData } from '../../app/model';
import useStoredCurrentUserData, {
  getStoredCurrentUserData, storeCurrentUserData,
} from '../../app/model/CurrentUserDataStorage';
import { fakeCurrentUser, fakeOtherCurrentUser } from '../FakeData';

describe('CurrentUserDataStorage', () => {
  beforeEach(async () => {
    await storeCurrentUserData(null);
    const storedCurrentUserData = await getStoredCurrentUserData();
    expect(storedCurrentUserData).toBeNull();
    expect(isCurrentUserData(fakeCurrentUser)).toBeTruthy();
    expect(isCurrentUserData(fakeOtherCurrentUser)).toBeTruthy();
  });

  describe('getStoredCurrentUserData', () => {
    it('returns the last user stored with storeCurrentUserData', async () => {
      await storeCurrentUserData(fakeCurrentUser);
      let storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id === fakeCurrentUser.id).toBeTruthy();

      await storeCurrentUserData(fakeOtherCurrentUser);
      storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id === fakeOtherCurrentUser.id)
        .toBeTruthy();
    });
  });

  describe('storeCurrentUserData', () => {
    it('should store valid user data', async () => {
      await storeCurrentUserData(fakeOtherCurrentUser);
      const storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id === fakeOtherCurrentUser.id)
        .toBeTruthy();
    });

    it('should store null user data', async () => {
      await storeCurrentUserData(fakeOtherCurrentUser);
      let storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData).toBeTruthy();

      await storeCurrentUserData(null);
      storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData).toBeNull();
    });

    it('should not store invalid user data', async () => {
      jest.spyOn(console, 'warn').mockImplementation();
      const { pseudonym, ...invalidUser } = fakeCurrentUser;
      expect(isCurrentUserData(invalidUser)).toBeFalsy();
      storeCurrentUserData(invalidUser as any);
      const storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id).not.toEqual(invalidUser.id);
    });
  });
});

const storedCurrentUserDataTestId = 'storedCurrentUserDataTestId';
const intializedTestId = 'intializedTestId';

type Props = {
  initialCurrentUserData?: CurrentUserData;
  newCurrentUserData?: CurrentUserData | null;
};

function TestComponent({
  initialCurrentUserData, newCurrentUserData,
}: Props) {
  const {
    setStoredCurrentUserData, storedCurrentUserData, initialized,
  } = useStoredCurrentUserData(initialCurrentUserData);

  useEffect(() => {
    expect(initialized).toBeFalsy();
  }, []);

  useEffect(() => {
    if (newCurrentUserData !== undefined) {
      setStoredCurrentUserData(newCurrentUserData);
    }
  }, []);

  return (
    <>
      <Text testID={storedCurrentUserDataTestId}>
        {storedCurrentUserData && storedCurrentUserData.id}
      </Text>
      <Text testID={intializedTestId}>{initialized}</Text>
    </>
  );
}

TestComponent.defaultProps = {
  initialCurrentUserData: undefined,
  newCurrentUserData: undefined,
};

async function renderTestComponent({
  initialCurrentUserData, newCurrentUserData,
}: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create(
      <TestComponent
        initialCurrentUserData={initialCurrentUserData}
        newCurrentUserData={newCurrentUserData}
      />,
    );
  });
  const root = renderer?.root;
  function findByTestId(testID: string) {
    return root?.findByProps({ testID }).props.children;
  }
  const storedCurrentUserDataId = findByTestId(storedCurrentUserDataTestId);
  const initialized = findByTestId(intializedTestId);
  return { storedCurrentUserDataId, initialized };
}

describe('useStoredCurrentUserData', () => {
  afterEach(async () => {
    await storeCurrentUserData(null);
  });
  describe('initialized', () => {
    it('is true after storedCurrentUserData is initialized', async () => {
      const { initialized } = await renderTestComponent({});
      expect(initialized).toBeTruthy();
    });
  });

  describe('storedCurrentUserData', () => {
    it('is initialized by prop when present', async () => {
      const initialCurrentUserData = fakeCurrentUser;
      const {
        storedCurrentUserDataId,
      } = await renderTestComponent({ initialCurrentUserData });
      expect(storedCurrentUserDataId).toBe(initialCurrentUserData.id);
    });

    it('is initialized by getStoredCurrentUserData when prop absent', async () => {
      const currentUserData = fakeCurrentUser;
      await storeCurrentUserData(currentUserData);
      const { storedCurrentUserDataId } = await renderTestComponent({});
      expect(storedCurrentUserDataId).toBe(currentUserData.id);
    });

    it('is initially null when prop absent and no storedCurrentUserData', async () => {
      const { storedCurrentUserDataId } = await renderTestComponent({});
      expect(storedCurrentUserDataId).toBeNull();
    });
  });

  describe('setStoredCurrentUserData', () => {
    it('updates storedCurrentUserData', async () => {
      const newCurrentUserData = fakeOtherCurrentUser;
      const { storedCurrentUserDataId } = await renderTestComponent({
        initialCurrentUserData: fakeCurrentUser,
        newCurrentUserData,
      });
      expect(storedCurrentUserDataId).toBe(newCurrentUserData.id);
    });

    it('should not clear stored current user data', async () => {
      const initialCurrentUserData = fakeCurrentUser;
      await renderTestComponent({
        initialCurrentUserData,
        newCurrentUserData: null,
      });
      const storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id).toBe(initialCurrentUserData.id);
    });
  });
});
