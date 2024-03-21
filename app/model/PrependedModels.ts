import { useEffect, useState } from 'react';
import { Model, isDefined } from './types';

type Props<T extends Model> = {
  getCachedModel: (id: string) => T | undefined;
  maybePrependedModelId?: string;
  models: T[];
  onNewPrependedModel?: () => void;
  ready: boolean;
};

export default function usePrependedModels<T extends Model>({
  getCachedModel, maybePrependedModelId, models, onNewPrependedModel, ready,
}: Props<T>) {
  const [allModels, setAllModels] = useState<T[]>(models);
  const [prependedModelIds, setPrependedModelIds] = useState<string[]>([]);

  useEffect(() => {
    if (!ready || !maybePrependedModelId) { return; }
    const newlyPrependedModelId = maybePrependedModelId;

    // Prepend new model to previously prepended models
    // This is needed for the situation where the user creates multiple models
    // without pulling-to-refresh.
    setPrependedModelIds((ids) => [newlyPrependedModelId, ...ids]);
  }, [maybePrependedModelId, ready]);

  useEffect(() => {
    const prependedModels = (prependedModelIds ?? [])
      .map(getCachedModel)
      .filter(isDefined);
    const newAllModels = [...prependedModels, ...models];
    const deduplicatedNewAllModels = [...new Set(newAllModels)];
    setAllModels(deduplicatedNewAllModels);
  }, [models, getCachedModel, prependedModelIds]);

  useEffect(() => {
    if (maybePrependedModelId) {
      onNewPrependedModel?.();
    }
  }, [maybePrependedModelId]);

  function resetPrependedModels() {
    setPrependedModelIds([]);
  }

  return { allModels, resetPrependedModels };
}
