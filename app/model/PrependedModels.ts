import { useEffect, useState } from 'react';
import { Model, isDefined } from './types';

type Props<T extends Model> = {
  getCachedModel: (id: string) => T | undefined;
  maybePrependedModelIds?: string[];
  models: T[];
  ready: boolean;
};

export default function usePrependedModels<T extends Model>({
  getCachedModel, models, ready, maybePrependedModelIds,
}: Props<T>) {
  const [allModels, setAllModels] = useState<T[]>(models);
  const [prependedModelIds, setPrependedModelIds] = useState<string[]>([]);

  useEffect(() => {
    if (!ready || !maybePrependedModelIds?.length) { return; }
    const newlyPrependedModelIds = maybePrependedModelIds;

    // Prepend new models to already prepended new models
    // This is needed for the situation where the user creates multiple models
    // without pulling-to-refresh.
    setPrependedModelIds((ids) => [...newlyPrependedModelIds, ...ids]);
  }, [maybePrependedModelIds, ready]);

  useEffect(() => {
    const prependedModels = (prependedModelIds ?? [])
      .map(getCachedModel)
      .filter(isDefined);
    const newAllModels = [...prependedModels, ...models];
    const deduplicatedNewAllModels = [...new Set(newAllModels)];
    setAllModels(deduplicatedNewAllModels);
  }, [models, getCachedModel, prependedModelIds]);

  function resetPrependedModels() {
    setPrependedModelIds([]);
  }

  return { allModels, resetPrependedModels };
}
