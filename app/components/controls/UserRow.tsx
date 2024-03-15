import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent, StyleSheet, Text, TextLayoutEventData,
  TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { User, getCircleColors, getTenure } from '../../model';
import useTheme from '../../Theme';

const CIRCLE_LINE_HEIGHT_MULTIPLE = 0.8;

// This returns the circleHeight and marginTop needed to center the circle on
// the first line of text. These values scale with the text size.
// onTextLayout must be attached to the Text component's onTextLayout event prop
function useCircleHeight(initialHeight: number) {
  const [circleHeight, setCircleHeight] = useState<number>(initialHeight);
  const [marginTop, setMarginTop] = useState<number>(0);
  const [textLayout, setTextLayout] = useState<TextLayoutEventData>();

  function onTextLayout({
    nativeEvent,
  }: NativeSyntheticEvent<TextLayoutEventData>) {
    setTextLayout(nativeEvent);
  }

  useEffect(() => {
    if (!textLayout) { return; }

    const { lines } = textLayout;
    const firstLine = lines[0];

    // This centers the circle on the first line text
    setCircleHeight(CIRCLE_LINE_HEIGHT_MULTIPLE * firstLine.height);
    setMarginTop(0.5 * (1 - CIRCLE_LINE_HEIGHT_MULTIPLE) * firstLine.height);
  }, [textLayout]);

  return { circleHeight, marginTop, onTextLayout };
}

const useStyles = () => {
  const {
    colors, font, shadows, sizes, spacing,
  } = useTheme();

  const { circleHeight, marginTop, onTextLayout } = useCircleHeight(sizes.icon);

  const styles = StyleSheet.create({
    circle: {
      aspectRatio: 1,
      borderRadius: circleHeight,
      borderWidth: 2,
      height: circleHeight,
      marginTop,
    },
    circleShadows: {
      ...shadows.elevation4,
    },
    compact: {
      paddingVertical: spacing.s,
    },
    container: {
      backgroundColor: colors.fill,
      gap: spacing.s,
      padding: spacing.m,
    },
    rowIcon: {
      color: colors.labelSecondary,
      fontSize: sizes.icon,
      marginEnd: spacing.xs,
    },
    rowSubtitle: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    rowSubtitleText: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
      marginEnd: spacing.m,
    },
    rowTitle: {
      // This must be flex-start instead of center to accomodate for titles that
      // take multiple lines
      alignItems: 'flex-start',

      flexDirection: 'row',
      gap: spacing.s,

      // Align with the clock icon below it
      marginStart: 2,
    },
    rowTitleText: {
      color: colors.label,
      flexShrink: 1,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { colors, onTextLayout, styles };
};

type Props = {
  compact?: boolean;
  disabled?: boolean;
  isMe: boolean;
  item: User;
  onPress?: (item: User) => void;
};

export default function UserRow({
  compact, disabled, isMe, item, onPress,
}: Props) {
  const {
    connectionCount, joinedAt, offices, pseudonym, recruitCount,
  } = item;
  const tenure = getTenure(joinedAt);

  const joinedOffices = offices.map((o) => o.title).join(', ');
  const title = [
    pseudonym,
    joinedOffices,
    isMe && 'Me',
  ].filter((e) => e).join(', ');

  const { colors, onTextLayout, styles } = useStyles();

  const {
    circleBackgroundColor: backgroundColor,
    circleBorderColor: borderColor,
  } = getCircleColors({ colors, isMe, offices });

  return (
    <TouchableHighlight
      disabled={disabled}
      onPress={() => onPress?.(item)}
      underlayColor={colors.label}
    >
      <View style={[styles.container, compact && styles.compact]}>
        <View style={styles.rowTitle}>
          <View
            style={[
              styles.circle,
              styles.circleShadows,
              { backgroundColor, borderColor },
            ]}
          />
          <Text onTextLayout={onTextLayout} style={styles.rowTitleText}>
            {title}
          </Text>
        </View>
        <View style={styles.rowSubtitle}>
          <Icon name="schedule" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{tenure}</Text>
          <Icon name="link" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{connectionCount}</Text>
          <Icon name="person-add-alt" style={styles.rowIcon} />
          <Text style={styles.rowSubtitleText}>{recruitCount}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
}

UserRow.defaultProps = {
  compact: false,
  disabled: false,
  onPress: () => null,
};
