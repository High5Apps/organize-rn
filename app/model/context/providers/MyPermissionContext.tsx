import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { MyPermission } from '../../types';
import { useModelCache } from './caches';

type MyPermissionWithId = MyPermission & {
  id: string;
};

const addScopeAsId = (myPermission: MyPermission) => ({
  id: myPermission.scope,
  ...myPermission,
});

type MyPermissionContextType = {
  cacheMyPermission: (myPermission: MyPermission) => void;
  cacheMyPermissions: (myPermissions?: MyPermission[]) => void;
  clearCachedMyPermissions: () => void;
  getCachedMyPermission: (scope?: string) => MyPermission | undefined;
};

const MyPermissionContext = createContext<MyPermissionContextType>({
  cacheMyPermission: () => {},
  cacheMyPermissions: () => {},
  clearCachedMyPermissions: () => {},
  getCachedMyPermission: () => undefined,
});

export function MyPermissionContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel,
    cacheModels,
    clearCachedModels,
    getCachedModel,
  } = useModelCache<MyPermissionWithId>();

  const myPermissionContext = useMemo<MyPermissionContextType>(() => ({
    cacheMyPermission: (myPermission: MyPermission) => cacheModel(
      addScopeAsId(myPermission),
    ),
    cacheMyPermissions: (myPermissions?: MyPermission[]) => cacheModels(
      myPermissions?.map(addScopeAsId),
    ),
    clearCachedMyPermissions: clearCachedModels,
    getCachedMyPermission: (scope?: string) => {
      const cachedModel = getCachedModel(scope);
      if (!cachedModel) { return undefined; }
      const { id, ...rest } = cachedModel;
      return rest;
    },
  }), [cacheModel, cacheModels, clearCachedModels, getCachedModel]);

  return (
    <MyPermissionContext.Provider value={myPermissionContext}>
      {children}
    </MyPermissionContext.Provider>
  );
}

export const useMyPermissionContext = () => useContext(MyPermissionContext);
