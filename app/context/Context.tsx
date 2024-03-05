import React, { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserContextProvider } from './UserContext';
import { PostContextProvider } from './PostContext';
import { CommentContextProvider } from './CommentContext';
import { BallotPreviewContextProvider } from './BallotPreviewContext';
import { UserPreviewContextProvider } from './UserPreviewContext';
import { CachedValueContextProvider } from './CachedValueContext';

export default function Context({ children }: PropsWithChildren<{}>) {
  return (
    <UserContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
          <BallotPreviewContextProvider>
            <UserPreviewContextProvider>
              <CachedValueContextProvider>
                <SafeAreaProvider>
                  {children}
                </SafeAreaProvider>
              </CachedValueContextProvider>
            </UserPreviewContextProvider>
          </BallotPreviewContextProvider>
        </CommentContextProvider>
      </PostContextProvider>
    </UserContextProvider>
  );
}
