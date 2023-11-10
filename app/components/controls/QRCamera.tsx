import React, { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Camera, Code, useCameraDevice, useCodeScanner,
} from 'react-native-vision-camera';
import { QRCodeDataParser, isDefined, isNonNull } from '../../model';
import { ErrorMessage, FadeInView } from '../views';
import FrameButton from './FrameButton';
import { SetQRValue } from './types';

type Props = {
  buttonDisabled?: boolean;
  enabled: boolean;
  onPress?: () => void;
  setQRValue: SetQRValue;
};

export default function QRCamera({
  buttonDisabled, children, enabled, onPress, setQRValue,
}: PropsWithChildren<Props>) {
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes: Code[]) => {
      const scannedValues = codes.map((code) => code.value).filter(isDefined);
      const uniqueScannedValues = [...new Set(scannedValues)];
      try {
        const maybeFirstQRValue = uniqueScannedValues.map(
          (scannedValue) => QRCodeDataParser({ input: scannedValue }).parse(),
        ).filter(isNonNull).at(0);
        if (maybeFirstQRValue) {
          setQRValue(maybeFirstQRValue);
        }
      } catch (e) {
        console.warn(e);
      }
    },
  });

  const device = useCameraDevice('back');

  let content;
  if (device) {
    content = (
      // This View is required as a workaround on iOS until this issue is fixed:
      // https://github.com/mrousavy/react-native-vision-camera/issues/1964
      <View style={[StyleSheet.absoluteFill]}>
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
    <FrameButton
      deemphasizeWhenDisabled
      disabled={buttonDisabled}
      onPress={onPress}
      showPressedInLightMode={buttonDisabled}
    >
      {content}
      {children}
    </FrameButton>
  );
}

QRCamera.defaultProps = {
  buttonDisabled: false,
  onPress: () => {},
};
