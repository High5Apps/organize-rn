import React, { Dispatch, SetStateAction, useState } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import TextButton from './TextButton';
import useTheme from '../../Theme';
import DateTimePickerModal from './DateTimePickerModal';

const LOCALE = 'en-US';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    text: {
      color: colors.label,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    textButtonOverrides: {
      fontSize: font.sizes.body,
    },
  });

  return { styles };
};

const formatDateTime = (d: Date) => (
  d.toLocaleString(LOCALE, {
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    month: 'short',
    weekday: 'short',
    year: 'numeric',
  })
);

type Props = {
  dateTime: Date;
  setDateTime: Dispatch<SetStateAction<Date>>
  style?: StyleProp<TextStyle>;
};

export default function DateTimeSelector({
  dateTime, setDateTime, style,
}: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const { styles } = useStyles();

  return (
    <>
      <TextButton
        onPress={() => setPickerVisible(!pickerVisible)}
        style={[styles.textButtonOverrides, style]}
      >
        {formatDateTime(dateTime)}
      </TextButton>
      <DateTimePickerModal
        dateTime={dateTime}
        setDateTime={setDateTime}
        setVisible={setPickerVisible}
        visible={pickerVisible}
      />
    </>
  );
}

DateTimeSelector.defaultProps = {
  style: {},
};
