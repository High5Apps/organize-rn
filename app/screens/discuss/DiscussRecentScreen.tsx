import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussRecentScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

export default function DiscussRecentScreen({
  navigation, route,
}: DiscussRecentScreenProps) {
  const prependedPostId = route.params?.prependedPostId;

  const { t } = useTranslation();

  return (
    <DiscussScreen <'Recent'>
      emptyListMessage={t('hint.emptyRecentDiscussions')}
      prependedPostId={prependedPostId}
      navigation={navigation}
      primaryButtonLabel={t('object.discussion')}
      screenName={route.name}
      sort="new"
    />
  );
}
