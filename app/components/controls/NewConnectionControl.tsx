import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { QRCodeValue } from '../../model';
import useTheme from '../../Theme';
import CameraControl from './CameraControl';

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
  expectedOrgId?: string;
  prompt: string;
  promptHidden?: boolean;
  qrValue: QRCodeValue | null;
  setQRValue: Dispatch<SetStateAction<QRCodeValue | null>>;
};

export default function NewConnectionControl({
  expectedOrgId, prompt, promptHidden, qrValue, setQRValue,
}: Props) {
  const { styles } = useStyles();

  return (
    <View style={styles.topContainer}>
      <CameraControl
        expectedOrgId={expectedOrgId}
        qrValue={qrValue}
        setQRValue={setQRValue}
      />
      {!promptHidden && <Text style={styles.prompt}>{prompt}</Text>}
    </View>
  );
}

NewConnectionControl.defaultProps = {
  expectedOrgId: null,
  promptHidden: false,
};
