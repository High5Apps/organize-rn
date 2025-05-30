import React, { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import NewOrgNavigationBar from './NewOrgNavigationBar';
import {
  HeaderText, LearnMoreModal, LockingScrollView, MultilineTextInput,
  ScreenBackground, SecondaryButton, TextInputRow,
} from '../../../components';
import { NewOrgSteps } from '../../../model';
import type {
  NewOrgScreenParams, NewOrgScreenProps,
} from '../../../navigation';
import useTheme from '../../../Theme';
import NewOrgStepNavigator from './NewOrgStepNavigator';
import { useTranslation } from '../../../i18n';

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
    autoCaptitalize, autoComplete, autoCorrect, body, header, headline,
    iconName, keyboardType, maxLength, message, messageMultiline, param,
    placeholder, title,
  } = NewOrgSteps[currentStep];
  const initialInput: string = route.params[param]?.toString() || '';

  const [input, setInput] = useState(initialInput);
  const [modalVisible, setModalVisible] = useState(false);

  const { styles } = useStyles();
  const { t } = useTranslation();

  const params: NewOrgScreenParams = {
    ...route.params,
    [param]: input,
  };

  const stepNavigator = NewOrgStepNavigator(navigation);
  const navigateNext = () => stepNavigator.navigateToNext(currentStep, params);
  const nextDisabled = (input.length === 0);

  const TextInput = messageMultiline ? MultilineTextInput : TextInputRow;

  return (
    <ScreenBackground>
      <LockingScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <LearnMoreModal
          body={body}
          headline={headline}
          iconName={iconName}
          setVisible={setModalVisible}
          visible={modalVisible}
        />
        <Text style={styles.title}>{title}</Text>
        <HeaderText style={styles.headerText}>{header}</HeaderText>
        <TextInput
          autoCapitalize={autoCaptitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          maxLength={maxLength}
          onChangeText={setInput}
          onSubmitEditing={() => {
            if (nextDisabled) { return; }
            navigateNext();
          }}
          placeholder={useMemo(placeholder, [])}
          style={messageMultiline && styles.multilineTextInput}
          submitBehavior="submit"
          value={input}
        />
        <Text style={styles.message}>{message}</Text>
        <SecondaryButton
          iconName="help-outline"
          label={t('action.learnMore')}
          onPress={() => setModalVisible(true)}
        />
      </LockingScrollView>
      <NewOrgNavigationBar
        backPressed={() => {
          stepNavigator.navigateToPrevious(currentStep, params);
        }}
        currentStep={currentStep}
        nextDisabled={nextDisabled}
        nextPressed={navigateNext}
      />
    </ScreenBackground>
  );
}
