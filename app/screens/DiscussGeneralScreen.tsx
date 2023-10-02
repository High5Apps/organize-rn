import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGeneralScreenProps } from '../navigation';

export default function DiscussGeneralScreen({
  navigation, route,
}: DiscussGeneralScreenProps) {
  const insertedPostIds = route.params?.insertedPostIds;

  return (
    <DiscussScreen <'General'>
      category="general"
      emptyListMessage={"Kick things off right by creating your Org's first **general discussion**.\n\nOnly your Org's **members** can read these discussions. Even the app's developers can't read them.\n\nTap the button below to get started!"}
      insertedPostIds={insertedPostIds}
      navigation={navigation}
      primaryButtonLabel="Discussion"
      sort="hot"
    />
  );
}
