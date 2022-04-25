import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
  onQRCodeValueScanned: () => void;
  prompt: string;
  promptHidden?: boolean;
};

export default function NewConnectionControl({
  expectedOrgId, onQRCodeValueScanned, prompt, promptHidden,
}: Props) {
  const { styles } = useStyles();

  return (
    <View style={styles.topContainer}>
      <CameraControl
        expectedOrgId={expectedOrgId}
        onQRCodeValueScanned={onQRCodeValueScanned}
      />
      {!promptHidden && <Text style={styles.prompt}>{prompt}</Text>}
    </View>
  );
}

NewConnectionControl.defaultProps = {
  expectedOrgId: null,
  promptHidden: false,
};
