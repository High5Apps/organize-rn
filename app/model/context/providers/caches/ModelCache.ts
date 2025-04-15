import { useState } from 'react';
import isEqual from 'react-fast-compare';
import { Model } from '../../../types';

function modelToEntry<T extends Model>(model: T) {
  return [model.id, model] as const;
}

function modelsToMap<T extends Model>(models: T[]) {
  return new Map(models.map(modelToEntry));
}

export default function useModelCache<T extends Model>() {
  const [modelCache, setModelCache] = useState<Map<string, T>>(new Map());

  function clearCachedModels() {
    setModelCache(new Map());
  }

  function getCachedModel(id?: string) {
    if (id === undefined) { return undefined; }
    return modelCache.get(id);
  }

  function cacheModels(models?: T[]) {
    if (models === undefined) { return; }

    setModelCache((mc) => {
      const allEqual = models.every((model) => {
        const cachedModel = mc.get(model.id);
        return cachedModel && isEqual(model, cachedModel);
      });

      if (allEqual) { return mc; }

      const unequalModels = models.map((model) => {
        const cachedModel = mc.get(model.id);
        const equal = cachedModel && isEqual(model, cachedModel);
        return equal ? cachedModel : model;
      });

      const cachedModels = [...mc.values()];
      return modelsToMap([...cachedModels, ...unequalModels]);
    });
  }

  function cacheModel(model: T) {
    cacheModels([model]);
  }

  return {
    cacheModel, cacheModels, clearCachedModels, getCachedModel,
  };
}
