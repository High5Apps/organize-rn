import React from 'react';
import Navigation from './navigation';
import { StatusBar } from './components';
import { Context } from './model';

export default function App() {
  return (
    <StatusBar>
      <Context>
        <Navigation />
      </Context>
    </StatusBar>
  );
}
