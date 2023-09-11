import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussDemandsScreenProps } from '../navigation';

export default function DiscussDemandsScreen({
  navigation,
}: DiscussDemandsScreenProps) {
  return (
    <DiscussScreen <'Demands'>
      category="demands"
      emptyListMessage={"What are you really fighting for?\n\nDemands let you voice how specific things should change for the better.\n\nOver time, Org members' upvotes and downvotes will help everyone come to a consensus."}
      navigation={navigation}
      primaryButtonLabel="Demand"
    />
  );
}
