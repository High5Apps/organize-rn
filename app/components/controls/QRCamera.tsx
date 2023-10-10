import { NavigationAction, useNavigation } from '@react-navigation/native';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Camera, Code, useCameraDevice, useCodeScanner,
} from 'react-native-vision-camera';
import { QRCodeDataParser } from '../../model';
import { ErrorMessage, FadeInView } from '../views';
import FrameButton from './FrameButton';
import { SetQRValue } from './types';

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

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes: Code[]) => {
      const contentDataUrls: string[] = [];
      codes.forEach((code) => {
        const url = code.value;
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
    },
  });

  const device = useCameraDevice('back');

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
      // This View is required as a workaround on iOS until this issue is fixed:
      // https://github.com/mrousavy/react-native-vision-camera/issues/1964
      <View style={StyleSheet.absoluteFill}>
        <Camera
          codeScanner={codeScanner}
          device={device}
          isActive={enabled}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    );
  } else {
    content = (
      <FadeInView delay={2000}>
        <ErrorMessage message="No camera found" />
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
