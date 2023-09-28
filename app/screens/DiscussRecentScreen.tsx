import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussRecentScreenProps } from '../navigation';

export default function DiscussRecentScreen({
  navigation, route,
}: DiscussRecentScreenProps) {
  const newPostCreatedAt: number | undefined = route.params?.newPostCreatedAt;
  return (
    <DiscussScreen <'Recent'>
      emptyListMessage={"All of your Org's **newly created discussions** will show up here.\n\nBe the first in your Org to create a discussion by tapping the button below!"}
      navigation={navigation}
      newPostCreatedAt={newPostCreatedAt}
      primaryButtonLabel="Discussion"
      sort="new"
    />
  );
}
