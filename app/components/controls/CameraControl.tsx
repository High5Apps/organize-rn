import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { QRCodeValue } from '../../model';
import { ConnectionReview, IconPrompt, MembershipReview } from '../views';
import QRCamera from './QRCamera';

type Props = {
  expectedOrgId?: string;
  qrValue: QRCodeValue | null;
  setQRValue: Dispatch<SetStateAction<QRCodeValue | null>>;
};

export default function CameraControl({
  expectedOrgId, qrValue, setQRValue,
}: Props): JSX.Element {
  const [
    cameraPermission, setCameraPermission,
  ] = useState<CameraPermissionStatus>();
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    const setPermissions = async () => {
      setCameraPermission(await Camera.getCameraPermissionStatus());
    };
    setPermissions().catch(console.error);
  }, []);

  useEffect(() => {
    setCameraEnabled(!qrValue);
  }, [qrValue]);

  let onPress: () => void | Promise<void>;
  let iconName: string = 'qr-code-scanner';
  let prompt: string = 'Tap to allow\ncamera access';
  if (cameraPermission === 'not-determined') {
    onPress = async () => setCameraPermission(
      await Camera.requestCameraPermission(),
    );
  } else if (cameraPermission === 'authorized') {
    onPress = () => setCameraEnabled(true);
  } else if (cameraPermission === 'denied') {
    onPress = Linking.openSettings;
  } else {
    onPress = () => {};
    iconName = 'error';
    prompt = 'Camera access is restricted on your device. Unfortunately you won\'t be able to use Organize.';
  }

  const isAuthorized = cameraPermission === 'authorized';
  const shoudlShowCamera = isAuthorized && cameraEnabled && !qrValue;

  let CameraCover: JSX.Element | undefined;
  if (qrValue) {
    if (expectedOrgId) {
      CameraCover = (
        <ConnectionReview
          qrValue={qrValue}
          style={StyleSheet.absoluteFill}
        />
      );
    } else {
      CameraCover = (
        <MembershipReview
          qrValue={qrValue}
          style={StyleSheet.absoluteFill}
        />
      );
    }
  } else if (!shoudlShowCamera) {
    CameraCover = (
      <IconPrompt
        iconName={iconName}
        prompt={prompt}
        style={StyleSheet.absoluteFill}
      />
    );
  }

  const qrValueFilter = (
    (value: QRCodeValue) => (!expectedOrgId || (expectedOrgId === value.org.id))
  );

  return (
    <QRCamera
      buttonDisabled={!!qrValue}
      enabled={shoudlShowCamera}
      onPress={() => {
        setCameraEnabled(false);
        if (!shoudlShowCamera) {
          onPress();
        }
      }}
      qrValueFilter={qrValueFilter}
      setEnabled={setCameraEnabled}
      setQRValue={setQRValue}
    >
      {CameraCover}
    </QRCamera>
  );
}

CameraControl.defaultProps = {
  expectedOrgId: null,
};
