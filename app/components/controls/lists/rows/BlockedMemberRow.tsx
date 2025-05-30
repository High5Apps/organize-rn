import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModerationEvent, getMessageAge } from '../../../../model';
import useTheme from '../../../../Theme';
import { UnblockUserButton } from '../../buttons';
import { useTranslation } from '../../../../i18n';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
    rowSubtitleText: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginEnd: spacing.m,
    },
    rowTitleText: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { styles };
};

type Props = {
  item: ModerationEvent;
  onItemRemoved: () => void;
};

export default function BlockedMemberRow({ item, onItemRemoved }: Props) {
  const { styles } = useStyles();
  const { t } = useTranslation();

  const timeAgo = getMessageAge(item.createdAt);
  const subtitle = t('time.hint.past.modified', {
    modifier: t('modifier.blocked'), timeAgo,
  });

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.rowTitleText}>
          {item.moderatable.creator.pseudonym}
        </Text>
        <Text style={styles.rowSubtitleText}>{subtitle}</Text>
      </View>
      <UnblockUserButton
        moderationEvent={item}
        onUserUnblocked={onItemRemoved}
      />
    </View>
  );
}
