import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import NewOrgModal from './NewOrgModal';
import NewOrgNavigationBar from './NewOrgNavigationBar';
import { ScreenBackground, SecondaryButton, TextInputRow } from '../../components';
import { NewOrgSteps } from '../../model';
import type { NewOrgScreenParams, NewOrgScreenProps } from '../../navigation';
import useTheme from '../../Theme';
import NewOrgStepNavigator from './NewOrgStepNavigator';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    message: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      padding: spacing.m,
      paddingBottom: spacing.s,
      textAlign: 'center',
    },
    title: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.largeTitle,
      margin: spacing.m,
    },
  });

  return { styles };
};

export default function NewOrgScreen({ navigation, route }: NewOrgScreenProps) {
  const currentStep = route.params.step;
  const {
    body, headline, iconName, maxLength, message, param, paramType, placeholder,
    title,
  } = NewOrgSteps[currentStep];
  const initialInput: string = route.params[param]?.toString() || '';

  const [input, setInput] = useState(initialInput);
  const [modalVisible, setModalVisible] = useState(false);

  const { styles } = useStyles();

  const params: NewOrgScreenParams = {
    ...route.params,
    [param]: input,
  };

  const stepNavigator = NewOrgStepNavigator(navigation);
  const navigateNext = () => stepNavigator.navigateToNext(currentStep, params);
  const nextDisabled = (input.length === 0);

  return (
    <ScreenBackground>
      <NewOrgModal
        body={body}
        headline={headline}
        iconName={iconName}
        setVisible={setModalVisible}
        visible={modalVisible}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.title}>
          {title}
        </Text>
        <TextInputRow
          blurOnSubmit={false}
          keyboardType={paramType === 'number' ? 'number-pad' : 'default'}
          maxLength={maxLength}
          onChangeText={setInput}
          onSubmitEditing={() => {
            if (nextDisabled) { return; }
            navigateNext();
          }}
          placeholder={placeholder}
          value={input}
        />
        <Text style={styles.message}>
          {typeof message === 'function' ? message(params) : message}
        </Text>
        <SecondaryButton
          iconName="help-outline"
          label="Learn More"
          onPress={() => setModalVisible(true)}
        />
      </ScrollView>
      <KeyboardAccessoryView alwaysVisible androidAdjustResize hideBorder>
        <NewOrgNavigationBar
          backPressed={() => {
            stepNavigator.navigateToPrevious(currentStep, params);
          }}
          currentStep={currentStep}
          nextDisabled={nextDisabled}
          nextPressed={navigateNext}
        />
      </KeyboardAccessoryView>
    </ScreenBackground>
  );
}
