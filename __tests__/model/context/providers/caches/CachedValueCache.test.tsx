import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
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

function renderTestComponent({
  cachedKeyToUpdate, cachedValues,
}: Props) {
  render((
    <TestComponent
      cachedKeyToUpdate={cachedKeyToUpdate}
      cachedValues={cachedValues}
    />
  ));
}

describe('useCommentCache', () => {
  const cachedValues = [0, 0, 0];
  const cachedKeyToUpdate = cachedValues.length;

  it('should contain initially cached values', async () => {
    renderTestComponent({ cachedValues });
    cachedValues.map(valueToKey).forEach((key) => {
      const testID = key;
      expect(screen.getByTestId(testID)).toHaveTextContent('0');
    });
  });

  it('caching new value should not erase old values', async () => {
    renderTestComponent({
      cachedKeyToUpdate: cachedKeyToUpdate.toString(),
      cachedValues,
    });
    cachedValues.map(valueToKey).forEach((key) => {
      const testID = key;
      expect(screen.getByTestId(testID)).toHaveTextContent('0');
    });

    const testID = cachedKeyToUpdate.toString();
    expect(screen.getByTestId(testID)).toHaveTextContent('1');
  });

  it('should update previously cached value', async () => {
    renderTestComponent({
      cachedKeyToUpdate: cachedKeyToUpdate.toString(),
      cachedValues,
    });
    cachedValues.map(valueToKey).forEach((key) => {
      const testID = key;
      const expectedValue = (testID === cachedKeyToUpdate.toString())
        ? '1' : '0';
      expect(screen.getByTestId(testID)).toHaveTextContent(expectedValue);
    });
  });
});
