import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
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
  const { styles } = useStyles();

  const devices = useCameraDevices();
  const device = devices.back;
  console.log({ device });

  let content;
  if (device) {
    content = (
      <Camera
        device={device}
        isActive
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
