import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CurrentUserDataContextProvider } from './CurrentUserDataContext';
import { PostContextProvider } from './PostContext';
import { CommentContextProvider } from './CommentContext';
import { BallotPreviewContextProvider } from './BallotPreviewContext';
import { UserContextProvider } from './UserContext';
import { CachedValueContextProvider } from './CachedValueContext';
import { BallotContextProvider } from './BallotContext';
import { MyPermissionContextProvider } from './MyPermissionContext';
import { FlaggedItemContextProvider } from './FlaggedItemContext';

export default function Context({ children }: PropsWithChildren<{}>) {
  return (
    <CurrentUserDataContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
          <BallotPreviewContextProvider>
            <UserContextProvider>
              <BallotContextProvider>
                <MyPermissionContextProvider>
                  <FlaggedItemContextProvider>
                    <CachedValueContextProvider>
                      <SafeAreaProvider>
                        {children}
                      </SafeAreaProvider>
                    </CachedValueContextProvider>
                  </FlaggedItemContextProvider>
                </MyPermissionContextProvider>
              </BallotContextProvider>
            </UserContextProvider>
          </BallotPreviewContextProvider>
        </CommentContextProvider>
      </PostContextProvider>
    </CurrentUserDataContextProvider>
  );
}
