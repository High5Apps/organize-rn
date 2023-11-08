import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import BaseDateTimePickerModal, {
  CancelButton, ConfirmButton, CustomCancelButtonPropTypes,
  CustomConfirmButtonPropTypes, cancelButtonStyles,
} from 'react-native-modal-datetime-picker';
import useTheme from '../../Theme';

const useStyles = () => {
  const { colors, isDarkMode, sizes } = useTheme();

  const styles = StyleSheet.create({
    customCancelButtonContainerIOS: {
      borderColor: colors.separator,
      borderWidth: sizes.border,

      // Optional chaining is used because cancelButtonStyles only exists on iOS
      borderRadius: cancelButtonStyles?.button.borderRadius,
    },
    customConfirmButtonContainerIOS: {
      borderTopColor: colors.separator,
      borderTopWidth: sizes.separator,
    },
    pickerContainerStyleIOS: {
      borderColor: colors.separator,
      borderWidth: sizes.border,
    },
  });

  return { colors, isDarkMode, styles };
};

type Props = {
  dateTime: Date;
  setDateTime: Dispatch<SetStateAction<Date>>
  setVisible: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
};

export default function DateTimePickerModal({
  dateTime, setDateTime, setVisible, visible,
}: Props) {
  const { colors, isDarkMode, styles } = useStyles();

  const CustomCancelButtonIOS = useCallback((
    props: CustomCancelButtonPropTypes,
  ) => (
    <View style={styles.customCancelButtonContainerIOS}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <CancelButton {...props} />
    </View>
  ), [styles]);

  const CustomConfirmButtonIOS = useCallback((
    props: CustomConfirmButtonPropTypes,
  ) => (
    <View style={styles.customConfirmButtonContainerIOS}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ConfirmButton {...props} />
    </View>
  ), [styles]);

  return (
    <BaseDateTimePickerModal
      buttonTextColorIOS={colors.primary}
      accentColor={colors.primary}
      customCancelButtonIOS={CustomCancelButtonIOS}
      customConfirmButtonIOS={CustomConfirmButtonIOS}
      date={dateTime}
      display="inline"
      isDarkModeEnabled={isDarkMode}
      isVisible={visible}
      mode="datetime"
      onConfirm={(chosenDate) => {
        setDateTime(chosenDate);
        setVisible(false);
      }}
      onCancel={() => setVisible(false)}
      pickerContainerStyleIOS={styles.pickerContainerStyleIOS}
    />
  );
}
