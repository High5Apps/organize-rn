import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  FlagReport, ModerationEvent, ModerationEventAction, getMessageAge,
  getModeratableIcon, truncateText,
} from '../../../../model';
import useTheme from '../../../../Theme';
import { DisclosureIcon } from '../../../views';
import { SecondaryButton } from '../../buttons';
import { useTranslation, TFunction } from '../../../../i18n';

// This matches the max length for ballots and posts, but not comments, which is
// much longer.
const MAX_TITLE_LENGTH = 140;

const useStyles = () => {
  const {
    colors, font, opacity, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      paddingHorizontal: spacing.s,
    },
    buttonHidden: {
      opacity: opacity.disabled,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      columnGap: spacing.m,
    },
    container: {
      backgroundColor: colors.fill,
      paddingTop: spacing.m,
      paddingStart: spacing.m,

      // Without this, it seems like there's more space at end vs. start
      paddingEnd: spacing.s,
    },
    containerTop: {
      gap: spacing.s,
    },
    rowIcon: {
      alignSelf: 'flex-start',
      color: colors.labelSecondary,
      fontSize: sizes.icon,
      marginEnd: spacing.xs,
    },
    rowIconPrimary: {
      color: colors.primary,
    },
    rowSubtitle: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.xs,
    },
    rowSubtitleText: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginEnd: spacing.s,
    },
    rowTitle: {
      // This must be flex-start instead of center to accomodate for titles that
      // take multiple lines
      alignItems: 'flex-start',

      flexDirection: 'row',
      gap: spacing.xs,
    },
    rowTitleText: {
      color: colors.label,
      flex: 1,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
    rowTitleTextDeleted: {
      color: colors.labelSecondary,
    },
  });

  return { colors, styles };
};

function getModerationEventDependentValues(
  t: TFunction,
  moderationEvent?: ModerationEvent,
) {
  const wasPreviouslyAllowedOrBlocked = moderationEvent?.action === 'allow'
    || moderationEvent?.action === 'block';

  let eventActionMessage: string;
  let eventActionIcon: string;
  if (!wasPreviouslyAllowedOrBlocked) {
    eventActionMessage = t('modifier.pending');
    eventActionIcon = 'gavel';
  } else {
    const wasAllowed = moderationEvent.action === 'allow';

    eventActionIcon = wasAllowed ? 'check' : 'block';

    const action = t(wasAllowed ? 'modifier.allowed' : 'modifier.blocked');
    const timeAgo = getMessageAge(moderationEvent.createdAt);
    eventActionMessage = `${action} ${timeAgo}`;
  }

  const isEventInFlight = !!moderationEvent && moderationEvent.id === undefined;

  return {
    eventActionIcon,
    eventActionMessage,
    isEventInFlight,
    wasPreviouslyAllowedOrBlocked,
  };
}

type Props = {
  currentUserId: string;
  currentUserPseudonym: string;
  item: FlagReport;
  onFlagReportChanged: (
    previousFlagReport: FlagReport,
    flagReport: Required<FlagReport>,
  ) => void,
  onPress?: (item: FlagReport) => void;
};

export default function FlagReportRow({
  currentUserId, currentUserPseudonym, item, onFlagReportChanged,
  onPress = () => null,
}: Props) {
  const {
    flaggable, flagCount, moderationEvent,
  } = item;
  const { t } = useTranslation();
  const {
    eventActionIcon, eventActionMessage, isEventInFlight,
    wasPreviouslyAllowedOrBlocked,
  } = getModerationEventDependentValues(t, moderationEvent);

  const title = useMemo(
    () => (flaggable.deletedAt ? '[left Org]'
      : truncateText({ maxLength: MAX_TITLE_LENGTH, text: flaggable.title })
        // Replace whitespace with space to prevent newlines from affecting
        // layout
        .replace(/\s/g, ' ')
    ),
    [flaggable.deletedAt, flaggable.title],
  );

  const { colors, styles } = useStyles();

  const wrappedOnFlagReportChanged = useCallback(
    (buttonAction: 'allow' | 'block' | 'undo') => {
      let action: ModerationEventAction;
      if (buttonAction === 'allow' || buttonAction === 'block') {
        action = buttonAction;
      } else if (item.moderationEvent?.action === 'allow') {
        action = 'undo_allow';
      } else {
        action = 'undo_block';
      }

      onFlagReportChanged(item, {
        ...item,
        moderationEvent: {
          action,
          createdAt: new Date(),
          moderatable: {
            category: item.flaggable.category,
            creator: item.flaggable.creator,
            id: item.flaggable.id,
          },
          moderator: {
            id: currentUserId,
            pseudonym: currentUserPseudonym,
          },
        },
      });
    },
    [currentUserId, currentUserPseudonym, item],
  );

  return (
    <TouchableHighlight
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={styles.container}>
        <View style={styles.containerTop}>
          <View style={styles.rowTitle}>
            <Icon
              name={getModeratableIcon(flaggable.category)}
              style={[styles.rowIcon, styles.rowIconPrimary]}
            />
            <Text
              style={[
                styles.rowTitleText,
                flaggable.deletedAt && styles.rowTitleTextDeleted,
              ]}
            >
              {title}
            </Text>
            <DisclosureIcon />
          </View>
          <View style={styles.rowSubtitle}>
            <Icon name="flag" style={styles.rowIcon} />
            <Text style={styles.rowSubtitleText}>{flagCount}</Text>
            <Icon name="edit-square" style={styles.rowIcon} />
            <Text style={styles.rowSubtitleText}>{flaggable.creator.pseudonym}</Text>
          </View>
          <View style={styles.rowSubtitle}>
            <Icon name={eventActionIcon} style={styles.rowIcon} />
            <Text style={styles.rowSubtitleText}>{eventActionMessage}</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          {wasPreviouslyAllowedOrBlocked ? (
            <SecondaryButton
              disabled={isEventInFlight}
              iconName="restart-alt"
              label={t('action.undo')}
              onPress={() => wrappedOnFlagReportChanged('undo')}
              style={[styles.button, isEventInFlight && styles.buttonHidden]}
            />
          ) : (
            <>
              <SecondaryButton
                disabled={isEventInFlight}
                iconName="check"
                label={t('action.allow')}
                onPress={() => wrappedOnFlagReportChanged('allow')}
                style={[styles.button, isEventInFlight && styles.buttonHidden]}
              />
              <SecondaryButton
                disabled={isEventInFlight}
                iconName="block"
                label={t('action.block')}
                onPress={() => wrappedOnFlagReportChanged('block')}
                style={[styles.button, isEventInFlight && styles.buttonHidden]}
              />
            </>
          )}
        </View>
      </View>
    </TouchableHighlight>
  );
}
