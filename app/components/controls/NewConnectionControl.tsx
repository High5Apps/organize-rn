import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { QRCodeValue } from '../../model';
import useTheme from '../../Theme';
import CameraControl from './CameraControl';
import { SetQRValue } from './types';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    prompt: {
      color: colors.label,
      fontFamily: font.weights.regular,
      fontSize: font.sizes.body,
      marginTop: spacing.m,
      textAlign: 'center',
    },
    topContainer: {
      padding: spacing.m,
    },
  });

  return { styles };
};

type Props = {
  prompt: string;
  promptHidden?: boolean;
  qrValue: QRCodeValue | null;
  ReviewComponent: ReactNode;
  setQRValue: SetQRValue;
};

export default function NewConnectionControl({
  prompt, promptHidden = false, qrValue, ReviewComponent, setQRValue,
}: Props) {
  const { styles } = useStyles();

  return (
    <View style={styles.topContainer}>
      <CameraControl
        qrValue={qrValue}
        ReviewComponent={ReviewComponent}
        setQRValue={setQRValue}
      />
      {!promptHidden && <Text style={styles.prompt}>{prompt}</Text>}
    </View>
  );
}
