import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import useTheme from '../../Theme';
import FrameButton from './FrameButton';
import { QRCodeValue } from '../../model';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    circleLogo: {
      backgroundColor: colors.primary,
      borderColor: colors.fill,
      position: 'absolute',
    },
  });
  return { colors, spacing, styles };
};

type Props = {
  onPress?: () => void;
  qrCodeValue: QRCodeValue;
};

export default function QRCodeButton({ onPress, qrCodeValue }: Props) {
  const [frameSize, setFrameSize] = useState(0);

  const { colors, spacing, styles } = useStyles();

  const qrCodeSize = frameSize - spacing.l;
  const qrLogoSize = 0.33 * qrCodeSize;

  return (
    <FrameButton
      onContainerSizeChange={({ width }) => setFrameSize(width)}
      onPress={onPress}
    >
      <QRCode
        color={colors.label}
        backgroundColor={colors.fill}
        size={qrCodeSize}
        value={JSON.stringify(qrCodeValue)}
      />
      <View
        style={[
          styles.circleLogo,
          {
            borderRadius: qrLogoSize / 2,
            borderWidth: qrLogoSize / 25,
            height: qrLogoSize,
            width: qrLogoSize,
          },
        ]}
      />
    </FrameButton>
  );
}

QRCodeButton.defaultProps = {
  onPress: () => {},
};
