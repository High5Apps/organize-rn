import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ScreenBackground } from '../components';
import { OrgScreenProps } from '../navigation';
import useTheme from '../Theme';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    text: {
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      color: colors.label,
      textAlign: 'center',
    },
  });

  return { styles };
};

export default function OrgScreen({ route }: OrgScreenProps) {
  const { name } = route;

  const { styles } = useStyles();

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <Text style={styles.text}>
          {name}
        </Text>
      </View>
    </ScreenBackground>
  );
}
