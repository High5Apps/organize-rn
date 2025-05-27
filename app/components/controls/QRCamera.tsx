import React, { PropsWithChildren, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
  Camera, Code, useCameraDevice, useCameraPermission, useCodeScanner,
} from 'react-native-vision-camera';
import { QRCodeDataParser, isDefined, isNonNull } from '../../model';
import { ErrorMessage, FadeInView } from '../views';
import { FrameButton } from './buttons';
import { SetQRValue } from './types';
import { useTranslation } from '../../i18n';

type Props = {
  buttonDisabled?: boolean;
  enabled: boolean;
  onPress?: () => void;
  setQRValue: SetQRValue;
};

export default function QRCamera({
  buttonDisabled = false, children, enabled, onPress = () => {}, setQRValue,
}: PropsWithChildren<Props>) {
  const [cameraInitialized, setCameraInitialized] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes: Code[]) => {
      const scannedValues = codes.map((code) => code.value).filter(isDefined);
      const uniqueScannedValues = [...new Set(scannedValues)];
      try {
        const maybeFirstQRValue = uniqueScannedValues.map(
          (scannedValue) => QRCodeDataParser().parse({ input: scannedValue }),
        ).filter(isNonNull).at(0);
        if (maybeFirstQRValue) {
          setQRValue(maybeFirstQRValue);
        }
      } catch (e) {
        console.warn(e);
      }
    },
  });

  const { hasPermission } = useCameraPermission();
  const device = hasPermission && useCameraDevice('back');

  const { t } = useTranslation();

  let content;
  if (device) {
    content = (
      <Camera
        codeScanner={codeScanner}
        device={device}
        isActive={enabled}
        // Waiting for cameraInitialized on Android but NOT iOS is a workaround
        // until this issue is fixed:
        // https://github.com/mrousavy/react-native-vision-camera/issues/1964
        onInitialized={() => setCameraInitialized(true)}
        style={
          (cameraInitialized || Platform.OS !== 'android')
            && StyleSheet.absoluteFill
        }
      />
    );
  } else {
    content = (
      <FadeInView delay={2000}>
        <ErrorMessage message={t('error.cameraNotFound')} />
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
