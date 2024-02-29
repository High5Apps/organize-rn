import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  BallotPreviewContextProvider, CachedValueContextProvider,
  CommentContextProvider, PostContextProvider, UserContextProvider,
  UserPreviewContextProvider,
} from './model';
import Navigation from './navigation';
import { StatusBar } from './components';

export default function App() {
  return (
    <StatusBar>
      <UserContextProvider>
        <PostContextProvider>
          <CommentContextProvider>
            <BallotPreviewContextProvider>
              <UserPreviewContextProvider>
                <CachedValueContextProvider>
                  <SafeAreaProvider>
                    <Navigation />
                  </SafeAreaProvider>
                </CachedValueContextProvider>
              </UserPreviewContextProvider>
            </BallotPreviewContextProvider>
          </CommentContextProvider>
        </PostContextProvider>
      </UserContextProvider>
    </StatusBar>
  );
}
