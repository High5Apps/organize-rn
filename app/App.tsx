import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  BallotContextProvider, CachedValueContextProvider, CommentContextProvider,
  PostContextProvider, UserContextProvider,
} from './model';
import Navigation from './navigation';
import { StatusBar } from './components';

export default function App() {
  return (
    <StatusBar>
      <UserContextProvider>
        <PostContextProvider>
          <CommentContextProvider>
            <BallotContextProvider>
              <CachedValueContextProvider>
                <SafeAreaProvider>
                  <Navigation />
                </SafeAreaProvider>
              </CachedValueContextProvider>
            </BallotContextProvider>
          </CommentContextProvider>
        </PostContextProvider>
      </UserContextProvider>
    </StatusBar>
  );
}
