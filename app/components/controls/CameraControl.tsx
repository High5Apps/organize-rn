import React, { useEffect, useState } from 'react';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import FramedIconPromptButton from './FramedIconPromptButton';
import QRCamera from './QRCamera';

export default function CameraControl(): JSX.Element {
  const [
    cameraPermission, setCameraPermission,
  ] = useState<CameraPermissionStatus>();

  useEffect(() => {
    const setPermissions = async () => {
      setCameraPermission(await Camera.getCameraPermissionStatus());
    };
    setPermissions().catch(console.error);
  }, []);

  if (cameraPermission === 'authorized') {
    return <QRCamera />;
  }

  return (
    <FramedIconPromptButton
      iconName="qr-code-scanner"
      onPress={async () => {
        setCameraPermission(await Camera.requestCameraPermission());
      }}
      prompt={'Tap to allow\ncamera access'}
    />
  );
}
