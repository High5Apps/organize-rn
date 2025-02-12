import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../../Theme';
import { TextButton } from './buttons';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'baseline',
      backgroundColor: colors.fillTertiary,
      flexDirection: 'row',
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.xs,
    },
    text: {
      color: colors.label,
      flex: 1,
      fontFamily: font.weights.medium,
      fontSize: font.sizes.body,
    },
  });

  return { styles };
};

type Props = {
  buttonText?: string;
  onPress?: (() => Promise<void>) | (() => void);
};

export default function SectionHeader({
  buttonText, children, onPress = () => {},
}: PropsWithChildren<Props>) {
  const { styles } = useStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
      {buttonText && <TextButton onPress={onPress}>{buttonText}</TextButton>}
    </View>
  );
}

type TitledSection = {
  title: string;
};

type SectionHeaderProps = {
  section: TitledSection;
};

export const renderSectionHeader = ({
  section: { title },
}: SectionHeaderProps) => <SectionHeader>{title}</SectionHeader>;
