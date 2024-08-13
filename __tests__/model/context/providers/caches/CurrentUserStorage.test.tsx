import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import { CurrentUserData, isCurrentUserData } from '../../../../../app/model';
import useStoredCurrentUserData, {
  getStoredCurrentUserData, storeCurrentUserData,
} from '../../../../../app/model/context/providers/caches/CurrentUserDataStorage';
import { fakeCurrentUserData, fakeOtherCurrentUserData } from '../../../../FakeData';

describe('CurrentUserDataStorage', () => {
  beforeEach(async () => {
    await storeCurrentUserData(null);
    const storedCurrentUserData = await getStoredCurrentUserData();
    expect(storedCurrentUserData).toBeNull();
    expect(isCurrentUserData(fakeCurrentUserData)).toBeTruthy();
    expect(isCurrentUserData(fakeOtherCurrentUserData)).toBeTruthy();
  });

  describe('getStoredCurrentUserData', () => {
    it('returns the last user stored with storeCurrentUserData', async () => {
      await storeCurrentUserData(fakeCurrentUserData);
      let storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id === fakeCurrentUserData.id).toBeTruthy();

      await storeCurrentUserData(fakeOtherCurrentUserData);
      storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id === fakeOtherCurrentUserData.id)
        .toBeTruthy();
    });
  });

  describe('storeCurrentUserData', () => {
    it('should store valid user data', async () => {
      await storeCurrentUserData(fakeOtherCurrentUserData);
      const storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id === fakeOtherCurrentUserData.id)
        .toBeTruthy();
    });

    it('should store null user data', async () => {
      await storeCurrentUserData(fakeOtherCurrentUserData);
      let storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData).toBeTruthy();

      await storeCurrentUserData(null);
      storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData).toBeNull();
    });

    it('should not store invalid user data', async () => {
      jest.spyOn(console, 'warn').mockImplementation();
      const { pseudonym, ...invalidCurrentUserData } = fakeCurrentUserData;
      expect(isCurrentUserData(invalidCurrentUserData)).toBeFalsy();
      storeCurrentUserData(invalidCurrentUserData as any);
      const storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id).not.toEqual(invalidCurrentUserData.id);
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
      const initialCurrentUserData = fakeCurrentUserData;
      const {
        storedCurrentUserDataId,
      } = await renderTestComponent({ initialCurrentUserData });
      expect(storedCurrentUserDataId).toBe(initialCurrentUserData.id);
    });

    it('is initialized by getStoredCurrentUserData when prop absent', async () => {
      const currentUserData = fakeCurrentUserData;
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
      const newCurrentUserData = fakeOtherCurrentUserData;
      const { storedCurrentUserDataId } = await renderTestComponent({
        initialCurrentUserData: fakeCurrentUserData,
        newCurrentUserData,
      });
      expect(storedCurrentUserDataId).toBe(newCurrentUserData.id);
    });

    it('should not clear stored current user data', async () => {
      const initialCurrentUserData = fakeCurrentUserData;
      await renderTestComponent({
        initialCurrentUserData,
        newCurrentUserData: null,
      });
      const storedCurrentUserData = await getStoredCurrentUserData();
      expect(storedCurrentUserData?.id).toBe(initialCurrentUserData.id);
    });
  });
});
