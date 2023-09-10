import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGeneralScreenProps } from '../navigation';

export default function DiscussGeneralScreen({
  navigation,
}: DiscussGeneralScreenProps) {
  return (
    <DiscussScreen <'General'>
      emptyListMessage={"Kick things off right by creating your Org's first general discussion.\n\nAll discussions are end-to-end encrypted, so even the app's developers can't read them.\n\nTap the button below to get started!"}
      navigation={navigation}
      primaryButtonLabel="Discussion"
    />
  );
}
