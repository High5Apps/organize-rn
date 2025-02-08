import { useEffect, useMemo, useState } from 'react';
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
  const [prependedModelIds, setPrependedModelIds] = useState<string[]>([]);
  const allModels = useMemo(() => {
    const prependedModels = (prependedModelIds ?? [])
      .map(getCachedModel)
      .filter(isDefined);
    const newAllModels = [...prependedModels, ...models];
    const deduplicatedNewAllModels = [...new Set(newAllModels)];
    return deduplicatedNewAllModels;
  }, [models, getCachedModel, prependedModelIds]);

  useEffect(() => {
    if (!ready || !maybePrependedModelId) { return; }
    const newlyPrependedModelId = maybePrependedModelId;

    // Prepend new model to previously prepended models
    // This is needed for the situation where the user creates multiple models
    // without pulling-to-refresh.
    setPrependedModelIds((ids) => [newlyPrependedModelId, ...ids]);
  }, [maybePrependedModelId, ready]);

  useEffect(() => {
    if (maybePrependedModelId) {
      onNewPrependedModel?.();
    }
  }, [maybePrependedModelId]);

  function removePrependedModel(id?: string) {
    setPrependedModelIds(prependedModelIds.filter(
      (prependedModelId) => (prependedModelId !== id),
    ));
  }

  function resetPrependedModels() {
    setPrependedModelIds([]);
  }

  return { allModels, removePrependedModel, resetPrependedModels };
}
