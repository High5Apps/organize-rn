import React from 'react';
import { CommentContextProvider, PostContextProvider, UserContextProvider } from './model';
import Navigation from './navigation';

export default function App() {
  return (
    <UserContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
          <Navigation />
        </CommentContextProvider>
      </PostContextProvider>
    </UserContextProvider>
  );
}
