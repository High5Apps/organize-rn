import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import useTheme from '../../Theme';
import FrameButton from './FrameButton';
import { CountdownClockBorder } from '../views';

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
  onTimeout?: () => void;
  qrCodeValue: string;
  timeout: number;
};

export default function QRCodeButton({
  onPress, onTimeout, qrCodeValue, timeout,
}: Props) {
  const [frameSize, setFrameSize] = useState(0);

  const { colors, spacing, styles } = useStyles();

  const qrCodeSize = frameSize - spacing.l;
  const qrLogoSize = 0.33 * qrCodeSize;

  return (
    <FrameButton
      onContainerSizeChange={({ width }) => setFrameSize(width)}
      onPress={onPress}
      style={{ borderWidth: 0 }}
    >
      <CountdownClockBorder
        duration={timeout}
        onFinished={onTimeout}
        // Add back the removed border width
        sideLength={frameSize + 2 * spacing.s}
      />
      <QRCode
        color={colors.label}
        backgroundColor={colors.fill}
        size={qrCodeSize}
        value={qrCodeValue}
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
  onTimeout: () => {},
};
