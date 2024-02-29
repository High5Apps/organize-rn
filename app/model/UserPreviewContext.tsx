import React, {
  PropsWithChildren, createContext, useContext, useMemo,
} from 'react';
import type { UserPreview } from './types';
import useModelCache from './ModelCache';

type UserPreviewContextType = {
  cacheUserPreview: (userPreview: UserPreview) => void;
  cacheUserPreviews: (userPreviews?: UserPreview[]) => void;
  getCachedUserPreview: (id?: string) => UserPreview | undefined;
};

const UserPreviewContext = createContext<UserPreviewContextType>({
  cacheUserPreview: () => {},
  cacheUserPreviews: () => {},
  getCachedUserPreview: () => undefined,
});

export function UserPreviewContextProvider({
  children,
}: PropsWithChildren<{}>) {
  const {
    cacheModel: cacheUserPreview,
    cacheModels: cacheUserPreviews,
    getCachedModel: getCachedUserPreview,
  } = useModelCache<UserPreview>();

  const userPreviewContext = useMemo<UserPreviewContextType>(() => ({
    cacheUserPreview, cacheUserPreviews, getCachedUserPreview,
  }), [cacheUserPreview, cacheUserPreviews, getCachedUserPreview]);

  return (
    <UserPreviewContext.Provider value={userPreviewContext}>
      {children}
    </UserPreviewContext.Provider>
  );
}

export const useUserPreviewContext = () => useContext(UserPreviewContext);
