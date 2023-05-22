import React from 'react';
import {
  LockingScrollView, OrgGraph, ScreenBackground, SectionHeader,
} from '../components';

export default function OrgScreen() {
  return (
    <ScreenBackground>
      <LockingScrollView>
        <SectionHeader>Members and connections</SectionHeader>
        <OrgGraph />
        <SectionHeader>Officers</SectionHeader>
      </LockingScrollView>
    </ScreenBackground>
  );
}
