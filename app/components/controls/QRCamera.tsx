import { NavigationAction, useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, useScanBarcodes } from 'vision-camera-code-scanner';
import { isQRCodeValue, QRCodeValue } from '../../model';
import useTheme from '../../Theme';
import { FadeInView } from '../views';
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
  buttonDisabled?: boolean;
  enabled: boolean;
  onPress?: () => void;
  onQRValueScanned: (value: QRCodeValue) => void;
  setEnabled: (enabled: boolean) => void;
};

export default function QRCamera({
  buttonDisabled, children, enabled, onPress, onQRValueScanned, setEnabled,
}: PropsWithChildren<Props>) {
  const [frameSize, setFrameSize] = useState(0);
  const [
    preventedAction, setPreventedAction,
  ] = useState<NavigationAction | undefined>();

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

  const navigation = useNavigation();

  useEffect(() => {
    const removeListener = navigation.addListener('beforeRemove', (e) => {
      if (enabled) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();

        setEnabled(false);
        setPreventedAction(e.data.action);
      }
    });
    return () => removeListener();
  }, [enabled, navigation, setEnabled]);

  useEffect(() => {
    if (!enabled && preventedAction) {
      // This delay prevents a memory leak caused by a race between camera
      // shutdown and unmount
      setTimeout(() => {
        navigation.dispatch(preventedAction);
      }, 50);
    }
  }, [enabled, preventedAction, navigation]);

  let content;
  if (device) {
    const qrCodeSize = frameSize - spacing.l;

    content = (
      <Camera
        device={device}
        frameProcessor={frameProcessor}
        isActive={enabled}
        style={[StyleSheet.absoluteFill]}
      >
        <View style={styles.qrOverlay}>
          <QRCode
            color={`${colors.primary}40`} // 25% alpha
            backgroundColor="transparent"
            size={qrCodeSize}
            value="You rock!"
          />
        </View>
      </Camera>
    );
  } else {
    content = (
      <FadeInView delay={2000}>
        <Text style={styles.noDevicesFound}>
          No camera found
        </Text>
      </FadeInView>
    );
  }

  return (
    <FrameButton
      disabled={buttonDisabled}
      onContainerSizeChange={({ width }) => setFrameSize(width)}
      onPress={onPress}
    >
      {content}
      {!preventedAction && children}
    </FrameButton>
  );
}

QRCamera.defaultProps = {
  buttonDisabled: false,
  onPress: () => {},
};
