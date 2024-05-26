import React from 'react';
import { StyleSheet } from 'react-native';
import type { BlockedMembersScreenProps } from '../../navigation';
import { BlockedMemberList, PrimaryButton, ScreenBackground } from '../../components';
import useTheme from '../../Theme';

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
  navigation,
}: BlockedMembersScreenProps) {
  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <BlockedMemberList />
      <PrimaryButton
        iconName="person-search"
        label="Select member"
        onPress={() => navigation.navigate('BlockMember')}
        style={styles.button}
      />
    </ScreenBackground>
  );
}
