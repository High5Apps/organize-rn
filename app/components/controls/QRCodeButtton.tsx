import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import useTheme from '../../Theme';
import FrameButton from './FrameButton';

const useStyles = () => {
  const { colors, spacing } = useTheme();

  const styles = StyleSheet.create({
    circleLogo: {
      backgroundColor: colors.primary,
      borderColor: colors.background,
      position: 'absolute',
    },
  });
  return { spacing, styles };
};

type Props = {
  onPress?: () => void;
};

export default function QRCodeButton({ onPress }: Props) {
  const [frameSize, setFrameSize] = useState(0);

  const { spacing, styles } = useStyles();

  const qrCodeSize = frameSize - spacing.l;
  const qrLogoSize = 0.33 * qrCodeSize;

  return (
    <FrameButton
      onContainerSizeChange={({ width }) => setFrameSize(width)}
      onPress={onPress}
    >
      <QRCode
        size={qrCodeSize}
        value="TODO: Add real data to the QR code"
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
