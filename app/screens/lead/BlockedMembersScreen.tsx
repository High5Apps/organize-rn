import React from 'react';
import { StyleSheet } from 'react-native';
import type { BlockedMembersScreenProps } from '../../navigation';
import { BlockedMemberList, PrimaryButton, ScreenBackground } from '../../components';
import useTheme from '../../Theme';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const { sizes, spacing } = useTheme();

  const buttonMargin = spacing.m;
  const buttonBoundingBoxHeight = 2 * buttonMargin + sizes.buttonHeight;

  const styles = StyleSheet.create({
    button: {
      bottom: buttonMargin,
      end: buttonMargin,
      height: sizes.buttonHeight,
      paddingHorizontal: buttonMargin,
      position: 'absolute',
    },
    contentContainerStyle: {
      paddingBottom: buttonBoundingBoxHeight,
    },
  });

  return { styles };
};

export default function BlockedMembersScreen({
  navigation, route,
}: BlockedMembersScreenProps) {
  const prependedModerationEventId = route.params?.prependedModerationEventId;

  const { styles } = useStyles();
  const { t } = useTranslation();

  return (
    <ScreenBackground>
      <BlockedMemberList
        contentContainerStyle={styles.contentContainerStyle}
        prependedModerationEventId={prependedModerationEventId}
      />
      <PrimaryButton
        iconName="person-search"
        label={t('action.selectMember')}
        onPress={() => navigation.navigate('BlockMember')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
