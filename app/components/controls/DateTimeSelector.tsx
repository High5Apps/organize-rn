import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import TextButton from './TextButton';
import useTheme from '../../Theme';
import DateTimePickerModal from './DateTimePickerModal';
import { formatDate } from '../../model';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'flex-start',
    },
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

type Props = {
  dateTime: Date;
  setDateTime: Dispatch<SetStateAction<Date>>
  style?: StyleProp<ViewStyle>;
};

export default function DateTimeSelector({
  dateTime, setDateTime, style,
}: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const { styles } = useStyles();

  return (
    <View style={[styles.container, style]}>
      <TextButton
        onPress={() => setPickerVisible(!pickerVisible)}
        style={styles.textButtonOverrides}
      >
        {formatDate(dateTime, 'full')}
      </TextButton>
      <DateTimePickerModal
        dateTime={dateTime}
        setDateTime={setDateTime}
        setVisible={setPickerVisible}
        visible={pickerVisible}
      />
    </View>
  );
}

DateTimeSelector.defaultProps = {
  style: {},
};

type DurationProps = {
  days: number;
};

export function startOfNextHourIn({ days }: DurationProps): Date {
  const now = new Date();
  const then = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  then.setHours(then.getHours() + 1);
  then.setMinutes(0, 0, 0);
  return then;
}
