import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussDemandsScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

export default function DiscussDemandsScreen({
  navigation, route,
}: DiscussDemandsScreenProps) {
  const prependedPostId = route.params?.prependedPostId;

  const { t } = useTranslation();

  return (
    <DiscussScreen <'Demands'>
      category="demands"
      emptyListMessage={t('hint.emptyDemandDiscussions')}
      prependedPostId={prependedPostId}
      navigation={navigation}
      primaryButtonLabel={t('object.demand', { count: 1 })}
      screenName={route.name}
      sort="top"
    />
  );
}
