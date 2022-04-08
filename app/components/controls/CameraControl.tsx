import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import QRButton from './QRButton';

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

  switch (cameraPermission) {
    case 'authorized':
      return (
        <Text>
          {cameraPermission}
        </Text>
      );
    default:
      return (
        <QRButton
          onPress={async () => {
            setCameraPermission(await Camera.requestCameraPermission());
          }}
        />
      );
  }
}
