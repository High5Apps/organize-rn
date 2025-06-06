import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { WorkGroup } from '../../types';
import { useModelCache } from './caches';

type WorkGroupContextType = {
  cacheWorkGroup: (workGroup: WorkGroup) => void;
  cacheWorkGroups: (workGroups?: WorkGroup[]) => void;
  clearCachedWorkGroups: () => void;
  getCachedWorkGroup: (workGroupId?: string) => WorkGroup | undefined;
};

const WorkGroupContext = createContext<WorkGroupContextType>({
  cacheWorkGroup: () => {},
  cacheWorkGroups: () => {},
  clearCachedWorkGroups: () => {},
  getCachedWorkGroup: () => undefined,
});

export function WorkGroupContextProvider({ children }: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheWorkGroup,
    cacheModels: cacheWorkGroups,
    clearCachedModels: clearCachedWorkGroups,
    getCachedModel: getCachedWorkGroup,
  } = useModelCache<WorkGroup>();

  const workGroupContext = useMemo<WorkGroupContextType>(() => ({
    cacheWorkGroup, cacheWorkGroups, clearCachedWorkGroups, getCachedWorkGroup,
  }), [
    cacheWorkGroup, cacheWorkGroups, clearCachedWorkGroups, getCachedWorkGroup,
  ]);

  return (
    <WorkGroupContext.Provider value={workGroupContext}>
      {children}
    </WorkGroupContext.Provider>
  );
}

export const useWorkGroupContext = () => useContext(WorkGroupContext);
