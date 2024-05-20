import React, { useCallback, useMemo } from 'react';
import {
  StyleSheet, Text, TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  FlagReport, ModerationEvent, ModerationEventAction, getFlagIcon,
  getMessageAge, truncateText,
} from '../../model';
import useTheme from '../../Theme';
import { DisclosureIcon } from '../views';
import SecondaryButton from './SecondaryButton';

// This matches the max length for ballots and posts, but not comments, which is
// much longer.
const MAX_TITLE_LENGTH = 140;

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    button: {
      paddingHorizontal: spacing.s,
    },
    buttonHidden: {
      opacity: 0,
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
  });

  return { colors, styles };
};

function getModerationEventDependentValues(moderationEvent?: ModerationEvent) {
  const wasPreviouslyAllowedOrBlocked = moderationEvent?.action === 'allow'
    || moderationEvent?.action === 'block';

  let eventActionMessage: string;
  let eventActionIcon: string;
  if (!wasPreviouslyAllowedOrBlocked) {
    eventActionMessage = 'Pending';
    eventActionIcon = 'gavel';
  } else {
    const wasAllowed = moderationEvent.action === 'allow';

    eventActionIcon = wasAllowed ? 'check' : 'block';

    const action = (wasAllowed) ? 'Allowed' : 'Blocked';
    const { pseudonym } = moderationEvent.moderator;
    const timeAgo = getMessageAge(moderationEvent.createdAt);
    eventActionMessage = `${action} by ${pseudonym} ${timeAgo}`;
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
  currentUserId, currentUserPseudonym, item, onFlagReportChanged, onPress,
}: Props) {
  const {
    flaggable, flagCount, moderationEvent,
  } = item;
  const {
    eventActionIcon, eventActionMessage, isEventInFlight,
    wasPreviouslyAllowedOrBlocked,
  } = getModerationEventDependentValues(moderationEvent);

  const title = useMemo(
    () => truncateText({ maxLength: MAX_TITLE_LENGTH, text: flaggable.title })
      // Replace whitespace with space to prevent newlines from affecting layout
      .replace(/\s/g, ' '),
    [flaggable.title],
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
              name={getFlagIcon(flaggable.category)}
              style={[styles.rowIcon, styles.rowIconPrimary]}
            />
            <Text style={styles.rowTitleText}>{title}</Text>
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
              label="Undo"
              onPress={() => wrappedOnFlagReportChanged('undo')}
              style={[styles.button, isEventInFlight && styles.buttonHidden]}
            />
          ) : (
            <>
              <SecondaryButton
                disabled={isEventInFlight}
                iconName="check"
                label="Allow"
                onPress={() => wrappedOnFlagReportChanged('allow')}
                style={[styles.button, isEventInFlight && styles.buttonHidden]}
              />
              <SecondaryButton
                disabled={isEventInFlight}
                iconName="block"
                label="Block"
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

FlagReportRow.defaultProps = {
  onPress: () => null,
};
