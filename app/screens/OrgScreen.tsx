import React from 'react';
import { LockingScrollView, OrgGraph, ScreenBackground } from '../components';

export default function OrgScreen() {
  return (
    <ScreenBackground>
      <LockingScrollView>
        <OrgGraph />
      </LockingScrollView>
    </ScreenBackground>
  );
}
