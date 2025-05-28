import React from 'react';
import DiscussScreen from './DiscussScreen';
import type { DiscussGeneralScreenProps } from '../../navigation';
import { useTranslation } from '../../i18n';

export default function DiscussGeneralScreen({
  navigation, route,
}: DiscussGeneralScreenProps) {
  const prependedPostId = route.params?.prependedPostId;

  const { t } = useTranslation();

  return (
    <DiscussScreen <'General'>
      category="general"
      emptyListMessage={t('hint.emptyGeneralDiscussions')}
      prependedPostId={prependedPostId}
      navigation={navigation}
      primaryButtonLabel={t('object.discussion')}
      screenName={route.name}
      sort="hot"
    />
  );
}
