import React, { ReactNode, useEffect, useState } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { QRCodeValue, useAppState } from '../../model';
import { IconPrompt } from '../views';
import QRCamera from './QRCamera';
import { SetQRValue } from './types';
import FrameButton from './FrameButton';

type Props = {
  qrValue: QRCodeValue | null;
  ReviewComponent: ReactNode;
  setQRValue: SetQRValue;
};

function getIconPrompt(cameraPermission: CameraPermissionStatus) {
  let iconName: string = 'qr-code-scanner';
  let prompt: string = 'Tap to allow\ncamera permissions';

  if (cameraPermission === 'granted') {
    prompt = 'Tap to show camera';
  } else if (cameraPermission === 'restricted') {
    iconName = 'error';
    prompt = "Camera access is restricted on your device. Unfortunately you won't be able to use Organize.";
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

  const appState = useAppState();

  useEffect(() => {
    if (appState !== 'active') { return; }

    const setPermissions = async () => {
      const permission = await Camera.getCameraPermissionStatus();
      setCameraPermission(permission);
    };
    setPermissions().catch(console.error);
  }, [appState]);

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

  if (!isAuthorized) {
    return (
      <FrameButton onPress={onPress}>
        {IconPromptComponent}
      </FrameButton>
    );
  }

  const shouldShowCamera = isAuthorized && cameraEnabled && !qrValue;
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
