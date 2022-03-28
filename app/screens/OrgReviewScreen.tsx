import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScreenBackground } from '../components';
import { OrgReviewScreenProps } from '../navigation';
import useTheme from '../Theme';

const useStyles = () => {
  const { font } = useTheme();

  const styles = StyleSheet.create({
    text: {
      fontSize: font.sizes.largeTitle,
      fontFamily: font.weights.regular,
    },
  });

  return { styles };
};

export default function OrgReviewScreen({ route }: OrgReviewScreenProps) {
  const { definition, estimate, name } = route.params;

  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <Text style={styles.text}>Org Review</Text>
      <Text>{definition}</Text>
      <Text>{estimate}</Text>
      <Text>{name}</Text>
    </ScreenBackground>
  );
}
