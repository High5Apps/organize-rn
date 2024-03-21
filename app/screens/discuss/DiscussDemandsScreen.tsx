import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussDemandsScreenProps } from '../../navigation';

export default function DiscussDemandsScreen({
  navigation, route,
}: DiscussDemandsScreenProps) {
  const prependedPostId = route.params?.prependedPostId;

  return (
    <DiscussScreen <'Demands'>
      category="demands"
      emptyListMessage={"Demands let you voice how specific things should **change for the better**.\n\nOver time, Org members' upvotes and downvotes will help everyone come to a **consensus**."}
      prependedPostId={prependedPostId}
      navigation={navigation}
      primaryButtonLabel="Demand"
      screenName={route.name}
      sort="top"
    />
  );
}
