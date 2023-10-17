import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  CachedValueContextProvider, CommentContextProvider, PostContextProvider,
  UserContextProvider,
} from './model';
import Navigation from './navigation';
import { StatusBar } from './components';

export default function App() {
  return (
    <StatusBar>
      <UserContextProvider>
        <PostContextProvider>
          <CommentContextProvider>
            <CachedValueContextProvider>
              <SafeAreaProvider>
                <Navigation />
              </SafeAreaProvider>
            </CachedValueContextProvider>
          </CommentContextProvider>
        </PostContextProvider>
      </UserContextProvider>
    </StatusBar>
  );
}
