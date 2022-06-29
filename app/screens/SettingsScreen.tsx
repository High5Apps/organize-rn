import React, { useCallback } from 'react';
import {
  Pressable, SectionList, StyleSheet, Text, View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScreenBackground } from '../components';
import {
  Settings, SettingsItem, SettingsSection, useUserContext,
} from '../model';
import useTheme from '../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    itemSeparator: {
      backgroundColor: colors.separator,
      height: sizes.separator,
      marginStart: spacing.m,
    },
    row: {
      alignItems: 'center',
      backgroundColor: colors.fill,
      flexDirection: 'row',
      padding: spacing.m,
    },
    rowHighlighted: {
      backgroundColor: colors.fillSecondary,
    },
    rowIcon: {
      color: colors.primary,
      fontSize: sizes.icon,
      marginEnd: spacing.s,
    },
    rowTitle: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    sectionHeader: {
      backgroundColor: colors.background,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.xs,
    },
    sectionHeaderTitle: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.semiBold,
    },
  });

  return { styles };
};

export default function SettingsScreen() {
  const { styles } = useStyles();
  const { currentUser, setCurrentUser } = useUserContext();

  const sections = Settings({ currentUser, setCurrentUser });

  const ItemSeparator = useCallback(() => (
    <View style={styles.itemSeparator} />
  ), [styles]);

  const renderRow = ({ item }: { item: SettingsItem }) => {
    const { iconName, onPress, title } = item;
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.row,
          pressed && styles.rowHighlighted,
        ]}
      >
        <Icon name={iconName} style={styles.rowIcon} />
        <Text style={styles.rowTitle}>{title}</Text>
      </Pressable>
    );
  };

  const renderSectionHeader = ({ section }: { section: SettingsSection }) => {
    const { title } = section;
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderTitle}>{title}</Text>
      </View>
    );
  };

  return (
    <ScreenBackground>
      <SectionList
        ItemSeparatorComponent={ItemSeparator}
        renderItem={renderRow}
        renderSectionHeader={renderSectionHeader}
        sections={sections}
      />
    </ScreenBackground>
  );
}
