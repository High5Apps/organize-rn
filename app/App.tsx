import React from 'react';
import { PostContextProvider, UserContextProvider } from './model';
import Navigation from './navigation';

export default function App() {
  return (
    <UserContextProvider>
      <PostContextProvider>
        <Navigation />
      </PostContextProvider>
    </UserContextProvider>
  );
}
