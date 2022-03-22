import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SecondaryButton from './SecondaryButton';
import useTheme from './Theme';

const useStyles = () => {
  const { colors, font, sizes } = useTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderTopColor: colors.separator,
      borderTopWidth: sizes.separator,
      flexDirection: 'row',
      height: sizes.buttonHeight,
      justifyContent: 'space-between',
    },
    currentStep: {
      color: colors.label,
      flexGrow: 1,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.paragraph,
      textAlign: 'center',
    },
    totalSteps: {
      color: colors.labelSecondary,
    },
  });
  return { styles };
};

type Props = {
  backPressed?: () => void;
  currentStep: number,
  nextDisabled?: boolean;
  nextPressed?: () => void;
  totalStepCount: number,
};

export default function NewOrgNavigationBar({
  backPressed, currentStep, nextDisabled, nextPressed, totalStepCount,
}: Props) {
  const { styles } = useStyles();
  return (
    <View style={styles.container}>
      <SecondaryButton
        iconName="navigate-before"
        label="Back"
        onPress={backPressed}
      />
      <Text style={styles.currentStep}>
        {`Step ${currentStep} `}
        <Text style={styles.totalSteps}>
          {`of ${totalStepCount}`}
        </Text>
      </Text>
      <SecondaryButton
        disabled={nextDisabled}
        iconName="navigate-next"
        label="Next"
        onPress={nextPressed}
        reversed
      />
    </View>
  );
}

NewOrgNavigationBar.defaultProps = {
  backPressed: () => {},
  nextDisabled: false,
  nextPressed: () => {},
};
