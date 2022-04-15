import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { isQRCodeValue, QRCodeValue } from '../../model';
import useTheme from '../../Theme';
import FrameButton from './FrameButton';

const useStyles = () => {
  const { colors, font, spacing } = useTheme();

  const styles = StyleSheet.create({
    noDevicesFound: {
      color: colors.error,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
    qrOverlay: {
      padding: spacing.m,
    },
  });
  return { colors, spacing, styles };
};

type Props = {
  enabled: boolean;
  onPress?: () => void;
  onQRValueScanned: (value: QRCodeValue) => void;
};

export default function QRCamera({
  enabled, onPress, onQRValueScanned,
}: Props) {
  const [frameSize, setFrameSize] = useState(0);

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    const contentData = barcodes.map((b) => b.content.data);
    const contentDataSet = new Set(contentData);
    const uniqueData = [...contentDataSet];
    try {
      uniqueData.forEach((json) => {
        const object = JSON.parse(String(json));
        if (isQRCodeValue(object)) {
          onQRValueScanned(object);
        } else {
          console.log(
            `parsed unexpected value: ${JSON.stringify(object, null, 2)}`,
          );
        }
      });
    } catch (e) {
      console.warn(e);
    }
  }, [barcodes]);

  const { colors, spacing, styles } = useStyles();

  const devices = useCameraDevices();
  const device = devices.back;

  const isFocused = useIsFocused();

  let content;
  if (device) {
    const qrCodeSize = frameSize - spacing.l;

    content = (
      <Camera
        device={device}
        frameProcessor={frameProcessor}
        frameProcessorFps={1}
        isActive={enabled && isFocused}
        style={[StyleSheet.absoluteFill, styles.qrOverlay]}
      >
        <QRCode
          color={`${colors.primary}40`} // 25% alpha
          backgroundColor="transparent"
          size={qrCodeSize}
          value="You rock!"
        />
      </Camera>
    );
  } else {
    content = (
      <Text style={styles.noDevicesFound}>
        No camera found
      </Text>
    );
  }

  return (
    <FrameButton
      onContainerSizeChange={({ width }) => setFrameSize(width)}
      onPress={onPress}
    >
      {content}
    </FrameButton>
  );
}

QRCamera.defaultProps = {
  onPress: () => {},
};
