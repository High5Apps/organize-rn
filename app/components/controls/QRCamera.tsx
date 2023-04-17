import { NavigationAction, useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import {
  BarcodeFormat, UrlBookmark, useScanBarcodes,
} from 'vision-camera-code-scanner';
import { QRCodeDataParser } from '../../model';
import useTheme from '../../Theme';
import { FadeInView } from '../views';
import FrameButton from './FrameButton';
import { SetQRValue } from './types';

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

type Props = {
  buttonDisabled?: boolean;
  enabled: boolean;
  onPress?: () => void;
  setEnabled: (enabled: boolean) => void;
  setQRValue: SetQRValue;
};

export default function QRCamera({
  buttonDisabled, children, enabled, onPress, setEnabled, setQRValue,
}: PropsWithChildren<Props>) {
  const [
    preventedAction, setPreventedAction,
  ] = useState<NavigationAction | undefined>();

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    const contentDataUrls: string[] = [];
    barcodes.forEach((b) => {
      const url = (b.content.data as UrlBookmark)?.url;
      if (url) {
        contentDataUrls.push(url);
      }
    });
    const urlSet = new Set(contentDataUrls);
    const uniqueUrls = [...urlSet];
    try {
      uniqueUrls.forEach((url) => {
        const qrValue = QRCodeDataParser({ url }).parse();
        if (!qrValue) { return; }
        setQRValue(qrValue);
      });
    } catch (e) {
      console.warn(e);
    }
  }, [barcodes]);

  const { styles } = useStyles();

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
    content = (
      <Camera
        device={device}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
        isActive={enabled}
        style={[StyleSheet.absoluteFill]}
      />
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
    <FrameButton disabled={buttonDisabled} onPress={onPress}>
      {content}
      {!preventedAction && children}
    </FrameButton>
  );
}

QRCamera.defaultProps = {
  buttonDisabled: false,
  onPress: () => {},
};
