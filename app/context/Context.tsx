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
import { FlagContextProvider } from './FlagContext';

export default function Context({ children }: PropsWithChildren<{}>) {
  return (
    <CurrentUserDataContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
          <BallotPreviewContextProvider>
            <UserContextProvider>
              <BallotContextProvider>
                <MyPermissionContextProvider>
                  <FlagContextProvider>
                    <CachedValueContextProvider>
                      <SafeAreaProvider>
                        {children}
                      </SafeAreaProvider>
                    </CachedValueContextProvider>
                  </FlagContextProvider>
                </MyPermissionContextProvider>
              </BallotContextProvider>
            </UserContextProvider>
          </BallotPreviewContextProvider>
        </CommentContextProvider>
      </PostContextProvider>
    </CurrentUserDataContextProvider>
  );
}
