import React, {
  JSX, ReactNode, useEffect, useState,
} from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { QRCodeValue, useAppState } from '../../model';
import { IconPrompt } from '../views';
import QRCamera from './QRCamera';
import { SetQRValue } from './types';
import { FrameButton } from './buttons';
import i18n from '../../i18n';

type Props = {
  qrValue: QRCodeValue | null;
  ReviewComponent: ReactNode;
  setQRValue: SetQRValue;
};

function getIconPrompt(cameraPermission: CameraPermissionStatus) {
  let iconName: string = 'qr-code-scanner';
  let prompt: string;

  if (cameraPermission === 'granted') {
    prompt = i18n.t('hint.tapToShowCamera');
  } else if (cameraPermission === 'restricted') {
    iconName = 'error';
    prompt = i18n.t('hint.cameraRestricted');
  } else {
    prompt = i18n.t('hint.tapToPermitCamera');
  }

  return (
    <IconPrompt
      iconName={iconName}
      prompt={prompt}
      style={StyleSheet.absoluteFill}
    />
  );
}

export default function CameraControl({
  qrValue, ReviewComponent, setQRValue,
}: Props): JSX.Element {
  const [
    cameraPermission, setCameraPermission,
  ] = useState<CameraPermissionStatus>('not-determined');
  const [cameraEnabled, setCameraEnabled] = useState(true);

  const isAppActive = useAppState() === 'active';
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isAppActive) { return; }

    const setPermissions = async () => {
      const permission = await Camera.getCameraPermissionStatus();
      setCameraPermission(permission);
    };
    setPermissions().catch(console.error);
  }, [isAppActive]);

  useEffect(() => {
    setCameraEnabled(!qrValue);
  }, [qrValue]);

  let onPress: () => void | Promise<void> = () => {};
  if (cameraPermission === 'not-determined') {
    onPress = async () => {
      const permission = await Camera.requestCameraPermission();
      setCameraPermission(permission);
    };
  } else if (cameraPermission === 'granted') {
    onPress = () => setCameraEnabled(!cameraEnabled);
  } else if (cameraPermission === 'denied') {
    onPress = Linking.openSettings;
  }

  const isAuthorized = cameraPermission === 'granted';
  const IconPromptComponent = getIconPrompt(cameraPermission);

  if (!isAuthorized && !qrValue) {
    return (
      <FrameButton onPress={onPress}>
        {IconPromptComponent}
      </FrameButton>
    );
  }

  const shouldShowCamera = (
    isAuthorized && cameraEnabled && isAppActive && isFocused && !qrValue
  );
  const CameraCover = qrValue ? ReviewComponent : IconPromptComponent;

  return (
    <QRCamera
      buttonDisabled={!!qrValue}
      enabled={shouldShowCamera}
      onPress={onPress}
      setQRValue={setQRValue}
    >
      {!shouldShowCamera && CameraCover}
    </QRCamera>
  );
}
