import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput,
} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import NewOrgModal from './NewOrgModal';
import NewOrgNavigationBar from './NewOrgNavigationBar';
import { ScreenBackground, SecondaryButton } from '../../components';
import { NewOrgSteps } from '../../model';
import { NewOrgScreenParams, NewOrgScreenProps, NewOrgStepNavigator } from '../../navigation';
import useTheme from '../../Theme';

const useStyles = () => {
  const {
    colors, font, sizes, spacing,
  } = useTheme();

  const styles = StyleSheet.create({
    message: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      padding: spacing.m,
      paddingBottom: spacing.s,
      textAlign: 'center',
    },
    textInput: {
      backgroundColor: colors.fill,
      borderBottomColor: colors.separator,
      borderBottomWidth: sizes.separator,
      color: colors.label,
      height: sizes.buttonHeight,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
    },
    title: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.largeTitle,
      margin: spacing.m,
    },
  });

  return { styles, colors };
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

  const { styles, colors } = useStyles();

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
        <TextInput
          autoFocus
          blurOnSubmit={false}
          keyboardType={paramType === 'number' ? 'number-pad' : 'default'}
          maxLength={maxLength}
          onChangeText={setInput}
          onSubmitEditing={() => {
            if (nextDisabled) { return; }
            navigateNext();
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.labelSecondary}
          returnKeyType="next"
          selectionColor={colors.primary}
          style={styles.textInput}
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