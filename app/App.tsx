import React from 'react';
import { UserContextProvider } from './model';
import Navigation from './navigation';

export default function App() {
  return (
    <UserContextProvider>
      <Navigation />
    </UserContextProvider>
  );
}
