import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SecondaryButton } from '../../../components';
import { NewOrgSteps } from '../../../model';
import useTheme from '../../../Theme';

const useStyles = () => {
  const { colors, font, sizes } = useTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: colors.fill,
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
      fontSize: font.sizes.body,
      textAlign: 'center',
    },
    totalSteps: {
      color: colors.labelSecondary,
    },
  });
  return { styles };
};

type Props = {
  backPressed: () => void;
  currentStep: number,
  nextDisabled?: boolean;
  nextPressed: () => void;
};

export default function NewOrgNavigationBar({
  backPressed, currentStep, nextDisabled = false, nextPressed,
}: Props) {
  const { styles } = useStyles();
  const { bottom: bottomInset } = useSafeAreaInsets();

  return (
    <KeyboardStickyView offset={{ opened: bottomInset }}>
      <View style={styles.container}>
        <SecondaryButton
          iconName="navigate-before"
          label="Back"
          onPress={backPressed}
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
          onPress={nextPressed}
          reversed
        />
      </View>
    </KeyboardStickyView>
  );
}
