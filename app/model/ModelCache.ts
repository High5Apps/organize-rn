import { useState } from 'react';

export type Model = {
  id: string;
};

function modelToEntry<T extends Model>(model: T) {
  return [model.id, model] as const;
}

function modelsToMap<T extends Model>(models: T[]) {
  return new Map(models.map(modelToEntry));
}

export default function useModelCache<T extends Model>() {
  const [modelCache, setModelCache] = useState<Map<string, T>>(new Map());

  function getCachedModel(id?: string) {
    if (id === undefined) { return undefined; }
    return modelCache.get(id);
  }

  function cacheModels(models?: T[]) {
    if (models === undefined) { return; }

    setModelCache((mc) => {
      const cachedModels = [...mc.values()];
      return modelsToMap([...cachedModels, ...models]);
    });
  }

  function cacheModel(model: T) {
    cacheModels([model]);
  }

  return { cacheModel, cacheModels, getCachedModel };
}
