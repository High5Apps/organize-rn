import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  BallotPreviewContextProvider, CachedValueContextProvider,
  CommentContextProvider, PostContextProvider, UserContextProvider,
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
              <CachedValueContextProvider>
                <SafeAreaProvider>
                  <Navigation />
                </SafeAreaProvider>
              </CachedValueContextProvider>
            </BallotPreviewContextProvider>
          </CommentContextProvider>
        </PostContextProvider>
      </UserContextProvider>
    </StatusBar>
  );
}
