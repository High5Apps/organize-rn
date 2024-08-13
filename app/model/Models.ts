import { useEffect, useState } from 'react';
import isEqual from 'react-fast-compare';
import { isDefined, Model } from './types';

export function getIdsFrom<T extends Model>(models?: T[]) {
  return (models ?? []).map((model) => model.id);
}

type Props<T extends Model> = {
  getCachedModel: (id?: string | undefined) => T | undefined;
};

export default function useModels<T extends Model>({
  getCachedModel,
}: Props<T>) {
  const [ids, setIds] = useState<string[]>([]);
  const [models, setModels] = useState<T[]>([]);

  // This doesn't allow updaters, because I couldn't figure out how to reliably
  // get the previous value. It's not necessarily just `ids` if wrappedSetIds is
  // called more than once per render. Instead of adding a subtle bug, I'm
  // opting to restrict its usage.
  // https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state
  function wrappedSetIds(newIds: string[]) {
    if (!isEqual(ids, newIds)) {
      setIds(newIds);
    }
  }

  useEffect(() => {
    const newModels = ids.map(getCachedModel).filter(isDefined);
    if (!isEqual(models, newModels)) {
      setModels(newModels);
    }
  }, [ids, getCachedModel]);
  return { ids, models, setIds: wrappedSetIds };
}
