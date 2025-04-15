import { act, renderHook } from '@testing-library/react-native';
import useCachedValueCache
  from '../../../../../app/model/context/providers/caches/CachedValueCache';

const valueToKey = (_: number, i: number) => i.toString();

describe('useCommentCache', () => {
  const cachedValues = [0, 0, 0];

  it('should contain initially cached values', async () => {
    const { result } = renderHook(useCachedValueCache);
    act(() => cachedValues.forEach(
      (cv, i) => result.current.setCachedValue(i.toString(), cv),
    ));
    cachedValues.map(valueToKey).forEach((key) => {
      expect(result.current.getCachedValue(key)).toBe(0);
    });
  });

  it('should clear the cache', () => {
    const { result } = renderHook(useCachedValueCache);
    act(() => cachedValues.forEach(
      (cv, i) => result.current.setCachedValue(i.toString(), cv),
    ));
    act(() => result.current.clearCachedValues());
    cachedValues.map(valueToKey).forEach((key) => {
      expect(result.current.getCachedValue(key)).toBeUndefined();
    });
  });

  it('caching new value should not erase old values', async () => {
    const { result } = renderHook(useCachedValueCache);
    act(() => cachedValues.forEach(
      (cv, i) => result.current.setCachedValue(i.toString(), cv),
    ));
    act(() => result.current.setCachedValue(cachedValues.length.toString(), 0));
    cachedValues.map(valueToKey).forEach((key) => {
      expect(result.current.getCachedValue(key)).toBe(0);
    });
  });

  it('should update previously cached value', async () => {
    const { result } = renderHook(useCachedValueCache);
    act(() => cachedValues.forEach(
      (cv, i) => result.current.setCachedValue(i.toString(), cv),
    ));
    const keyToUpdate = (cachedValues.length - 1).toString();
    act(() => result.current.setCachedValue(keyToUpdate, 1));
    cachedValues.map(valueToKey).forEach((key) => {
      const expectedValue = (key === keyToUpdate) ? 1 : 0;
      expect(result.current.getCachedValue(key)).toBe(expectedValue);
    });
  });
});
