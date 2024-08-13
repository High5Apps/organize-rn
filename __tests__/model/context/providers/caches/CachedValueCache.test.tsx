import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ReactTestRenderer, act, create } from 'react-test-renderer';
import useCachedValueCache from '../../../../../app/model/context/providers/caches/CachedValueCache';

type Props = {
  cachedKeyToUpdate?: string;
  cachedValues: number[];
};

const valueToKey = (_: number, i: number) => i.toString();

function TestComponent({ cachedKeyToUpdate, cachedValues }: Props) {
  const { getCachedValue, setCachedValue } = useCachedValueCache();
  const [
    cachedValueKeys, setCachedValueKeys,
  ] = useState<string[]>(cachedValues.map(valueToKey));

  useEffect(() => {
    cachedValues.forEach((cv, i) => setCachedValue(i.toString(), cv));

    if (cachedKeyToUpdate) {
      setCachedValue(cachedKeyToUpdate, 1);
      const updatedCachedValueKeys = [...cachedValueKeys, cachedKeyToUpdate];
      const deduplicatedCachedValueKeys = [...new Set(updatedCachedValueKeys)];
      setCachedValueKeys(deduplicatedCachedValueKeys);
    }
  }, []);

  return (
    <View>
      { cachedValueKeys.map((key) => (
        <Text key={key} testID={key}>{getCachedValue(key)}</Text>
      ))}
    </View>
  );
}

TestComponent.defaultProps = {
  cachedKeyToUpdate: undefined,
};

async function renderTestComponent({
  cachedKeyToUpdate, cachedValues,
}: Props) {
  let renderer: ReactTestRenderer | undefined;
  await act(async () => {
    renderer = create((
      <TestComponent
        cachedKeyToUpdate={cachedKeyToUpdate}
        cachedValues={cachedValues}
      />
    ));
  });
  const root = renderer?.root;
  return { root };
}

describe('useCommentCache', () => {
  const cachedValues = [0, 0, 0];
  const cachedKeyToUpdate = cachedValues.length;

  it('should contain initially cached values', async () => {
    const { root } = await renderTestComponent({ cachedValues });
    cachedValues.map(valueToKey).forEach((key) => {
      const testID = key;
      const text = root?.findByProps({ testID }).props.children;
      expect(text).toBe(0);
    });
  });

  it('caching new value should not erase old values', async () => {
    const { root } = await renderTestComponent({
      cachedKeyToUpdate: cachedKeyToUpdate.toString(),
      cachedValues,
    });
    cachedValues.map(valueToKey).forEach((key) => {
      const testID = key;
      const text = root?.findByProps({ testID }).props.children;
      expect(text).toBe(0);
    });

    const testID = cachedKeyToUpdate.toString();
    const text = root?.findByProps({ testID }).props.children;
    expect(text).toBe(1);
  });

  it('should update previously cached value', async () => {
    const { root } = await renderTestComponent({
      cachedKeyToUpdate: cachedKeyToUpdate.toString(),
      cachedValues,
    });
    cachedValues.map(valueToKey).forEach((key) => {
      const testID = key;
      const text = root?.findByProps({ testID }).props.children;
      const expectedValue = (testID === cachedKeyToUpdate.toString()) ? 1 : 0;
      expect(text).toBe(expectedValue);
    });
  });
});
