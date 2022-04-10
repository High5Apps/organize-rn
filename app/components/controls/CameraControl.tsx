import React, { useEffect, useState } from 'react';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import CameraPermissionsButton from './CameraPermissionsButton';
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

  console.log({ cameraPermission });

  if (cameraPermission === 'authorized') {
    return <QRCamera />;
  }

  return (
    <CameraPermissionsButton
      onPress={async () => {
        setCameraPermission(await Camera.requestCameraPermission());
      }}
    />
  );
}
