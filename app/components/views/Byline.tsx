import React from 'react';
import { StyleSheet, Text } from 'react-native';
import useTheme from '../../Theme';
import { getMessageAge } from '../../model';
import { useTranslation } from '../../i18n';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: colors.labelSecondary,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

type Props = {
  author: string;
  createdAt: Date;
};

export default function Byline({ author, createdAt }: Props) {
  const { styles } = useStyles();
  const { t } = useTranslation();
  const timeAgo = getMessageAge(createdAt);
  const subtitle = t('hint.byline', { author, timeAgo });
  return <Text style={styles.text}>{subtitle}</Text>;
}
