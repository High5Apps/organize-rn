import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NewOrgSteps from './NewOrgSteps';
import SecondaryButton from './SecondaryButton';
import useTheme from './Theme';
import { NewOrgScreenParams, RootStackNavigationProp } from './types';

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
  currentStep: number,
  nextDisabled?: boolean;
  params: NewOrgScreenParams;
  navigation: RootStackNavigationProp;
};

const name = 'NewOrg';

export const navigateToStep = (
  step: number,
  navigation: Props['navigation'],
  params?: Props['params'],
) => navigation.navigate({
  key: `${name}${step}`,
  name,
  params: {
    ...params,
    step,
  },
});

export default function NewOrgNavigationBar({
  currentStep, params, navigation, nextDisabled,
}: Props) {
  const { styles } = useStyles();

  const navigateToStepHelper = (
    step: number,
  ) => navigateToStep(step, navigation, params);

  return (
    <View style={styles.container}>
      <SecondaryButton
        iconName="navigate-before"
        label="Back"
        onPress={() => {
          if (currentStep > 0) {
            navigateToStepHelper(currentStep - 1);
          } else {
            navigation.goBack();
          }
        }}
      />
      <Text style={styles.currentStep}>
        {`Step ${1 + currentStep} `}
        <Text style={styles.totalSteps}>
          {/* The extra step is for the review page */}
          {`of ${1 + NewOrgSteps.length}`}
        </Text>
      </Text>
      <SecondaryButton
        disabled={nextDisabled}
        iconName="navigate-next"
        label="Next"
        onPress={() => {
          if (currentStep < NewOrgSteps.length - 1) {
            navigateToStepHelper(currentStep + 1);
          } else {
            const json = JSON.stringify(params, null, 2);
            console.log(`navigate to review: ${json}`);
          }
        }}
        reversed
      />
    </View>
  );
}

NewOrgNavigationBar.defaultProps = {
  nextDisabled: false,
};
