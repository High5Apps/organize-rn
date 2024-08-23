import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import NewOrgNavigationBar from './NewOrgNavigationBar';
import {
  HeaderText, KeyboardAvoidingScreenBackground, LearnMoreModal,
  MultilineTextInput, SecondaryButton, TextInputRow,
} from '../../../components';
import { NewOrgSteps } from '../../../model';
import type {
  NewOrgScreenParams, NewOrgScreenProps,
} from '../../../navigation';
import useTheme from '../../../Theme';
import NewOrgStepNavigator from './NewOrgStepNavigator';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    headerText: {
      marginHorizontal: spacing.m,
      marginBottom: spacing.s,
    },
    message: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      marginHorizontal: spacing.m,
      marginVertical: spacing.s,
      textAlign: 'center',
    },
    multilineTextInput: {
      marginHorizontal: spacing.m,
      maxHeight: 80,
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
    body, header, headline, iconName, maxLength, message, messageMultiline,
    param, paramType, placeholder, title,
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

  const TextInput = messageMultiline ? MultilineTextInput : TextInputRow;

  return (
    <KeyboardAvoidingScreenBackground topNavigationBarHidden>
      <LearnMoreModal
        body={body}
        headline={headline}
        iconName={iconName}
        setVisible={setModalVisible}
        visible={modalVisible}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {title}
        </Text>
        <HeaderText style={styles.headerText}>{header}</HeaderText>
        <TextInput
          autoFocus={false}
          blurOnSubmit={false}
          keyboardType={paramType === 'email' ? 'email-address' : 'default'}
          maxLength={maxLength}
          onChangeText={setInput}
          onSubmitEditing={() => {
            if (nextDisabled) { return; }
            navigateNext();
          }}
          placeholder={useMemo(placeholder, [])}
          style={messageMultiline && styles.multilineTextInput}
          value={input}
        />
        <Text style={styles.message}>{message}</Text>
        <SecondaryButton
          iconName="help-outline"
          label="Learn More"
          onPress={() => setModalVisible(true)}
        />
      </ScrollView>
      <NewOrgNavigationBar
        backPressed={() => {
          stepNavigator.navigateToPrevious(currentStep, params);
        }}
        currentStep={currentStep}
        nextDisabled={nextDisabled}
        nextPressed={navigateNext}
      />
    </KeyboardAvoidingScreenBackground>
  );
}
