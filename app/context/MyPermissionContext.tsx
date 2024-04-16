import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { MyPermission } from '../model';
import useModelCache from '../model/ModelCache';

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
  getCachedMyPermission: (scope?: string) => MyPermission | undefined;
};

const MyPermissionContext = createContext<MyPermissionContextType>({
  cacheMyPermission: () => {},
  cacheMyPermissions: () => {},
  getCachedMyPermission: () => undefined,
});

export function MyPermissionContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel,
    cacheModels,
    getCachedModel,
  } = useModelCache<MyPermissionWithId>();

  const myPermissionContext = useMemo<MyPermissionContextType>(() => ({
    cacheMyPermission: (myPermission: MyPermission) => cacheModel(
      addScopeAsId(myPermission),
    ),
    cacheMyPermissions: (myPermissions?: MyPermission[]) => cacheModels(
      myPermissions?.map(addScopeAsId),
    ),
    getCachedMyPermission: (scope?: string) => {
      const cachedModel = getCachedModel(scope);
      if (!cachedModel) { return undefined; }
      const { id, ...rest } = cachedModel;
      return rest;
    },
  }), [cacheModel, cacheModels, getCachedModel]);

  return (
    <MyPermissionContext.Provider value={myPermissionContext}>
      {children}
    </MyPermissionContext.Provider>
  );
}

export const useMyPermissionContext = () => useContext(MyPermissionContext);
