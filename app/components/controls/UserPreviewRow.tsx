import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent, StyleSheet, Text, TextLayoutEventData,
  TouchableHighlight, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { UserPreview, getCircleColors, getTenure } from '../../model';
import useTheme from '../../Theme';

const CIRCLE_LINE_HEIGHT_MULTIPLE = 0.8;

// This returns the circleHeight and marginTop needed to center the circle on
// the first line of text. These values scale with the text size.
// onTextLayout must be attached to the Text component's onTextLayout event prop
function useCircleHeight() {
  const [circleHeight, setCircleHeight] = useState<number>();
  const [marginTop, setMarginTop] = useState<number>();
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

  const { circleHeight, marginTop, onTextLayout } = useCircleHeight();

  const styles = StyleSheet.create({
    circle: {
      aspectRatio: 1,
      borderRadius: (circleHeight ?? 0) / 2,
      borderWidth: 2,
      height: circleHeight ?? sizes.icon,
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

      // Prevents a rare issue where the a blank second line can appear when the
      // first line's text is exactly as wide as the container
      flex: 0,

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
  item: UserPreview;
  onPress?: (item: UserPreview) => void;
};

export default function UserPreviewRow({
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

UserPreviewRow.defaultProps = {
  compact: false,
  disabled: false,
  onPress: () => null,
};
