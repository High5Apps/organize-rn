import React from 'react';
import {
  CachedValueContextProvider, CommentContextProvider, PostContextProvider,
  UserContextProvider,
} from './model';
import Navigation from './navigation';

export default function App() {
  return (
    <UserContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
          <CachedValueContextProvider>
            <Navigation />
          </CachedValueContextProvider>
        </CommentContextProvider>
      </PostContextProvider>
    </UserContextProvider>
  );
}
