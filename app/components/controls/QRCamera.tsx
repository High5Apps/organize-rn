import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import useTheme from '../../Theme';
import FrameButton from './FrameButton';

const useStyles = () => {
  const { colors, font } = useTheme();

  const styles = StyleSheet.create({
    noDevicesFound: {
      color: colors.error,
      fontSize: font.sizes.body,
      fontFamily: font.weights.regular,
    },
  });
  return { styles };
};

export default function QRCamera() {
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    const contentData = barcodes.map((b) => b.content.data);
    const contentDataSet = new Set(contentData);
    const uniqueData = [...contentDataSet];
    console.log({ uniqueData });
  }, [barcodes]);

  const { styles } = useStyles();

  const devices = useCameraDevices();
  const device = devices.back;

  const isFocused = useIsFocused();

  let content;
  if (device) {
    content = (
      <Camera
        device={device}
        frameProcessor={frameProcessor}
        frameProcessorFps={1}
        isActive={isFocused}
        style={StyleSheet.absoluteFill}
      />
    );
  } else {
    content = (
      <Text style={styles.noDevicesFound}>
        No camera found
      </Text>
    );
  }

  return (
    <FrameButton disabled showPressedInLightMode>
      {content}
    </FrameButton>
  );
}
