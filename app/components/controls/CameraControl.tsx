import React, { ReactNode, useEffect, useState } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { QRCodeValue } from '../../model';
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
  let prompt: string = 'Tap to allow\ncamera access';

  if (cameraPermission === 'authorized') {
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

  useEffect(() => {
    const setPermissions = async () => {
      const permission = await Camera.getCameraPermissionStatus();
      setCameraPermission(permission);
    };
    setPermissions().catch(console.error);
  }, []);

  useEffect(() => {
    setCameraEnabled(!qrValue);
  }, [qrValue]);

  let onPress: () => void | Promise<void> = () => {};
  if (cameraPermission === 'not-determined') {
    onPress = async () => {
      const permission = await Camera.requestCameraPermission();
      setCameraPermission(permission);
    };
  } else if (cameraPermission === 'authorized') {
    onPress = () => setCameraEnabled(!cameraEnabled);
  } else if (cameraPermission === 'denied') {
    onPress = Linking.openSettings;
  }

  const isAuthorized = cameraPermission === 'authorized';
  const IconPromptComponent = getIconPrompt(cameraPermission);

  if (!isAuthorized) {
    return (
      <FrameButton onPress={onPress}>
        {IconPromptComponent}
      </FrameButton>
    );
  }

  const shoudlShowCamera = isAuthorized && cameraEnabled && !qrValue;
  const CameraCover = qrValue ? ReviewComponent : IconPromptComponent;

  return (
    <QRCamera
      buttonDisabled={!!qrValue}
      enabled={shoudlShowCamera}
      onPress={onPress}
      setEnabled={setCameraEnabled}
      setQRValue={setQRValue}
    >
      {!shoudlShowCamera && CameraCover}
    </QRCamera>
  );
}
