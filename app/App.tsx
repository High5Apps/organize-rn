import React from 'react';
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
              <Navigation />
            </CachedValueContextProvider>
          </CommentContextProvider>
        </PostContextProvider>
      </UserContextProvider>
    </StatusBar>
  );
}
