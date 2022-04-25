import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { QRCodeValue } from '../../model';
import { ConnectionReview, MembershipReview } from '../views';
import FramedIconPromptButton from './FramedIconPromptButton';
import QRCamera from './QRCamera';

type Props = {
  expectedOrgId?: string;
  onQRCodeValueScanned?: (value: QRCodeValue) => void;
};

export default function CameraControl({
  expectedOrgId, onQRCodeValueScanned,
}: Props): JSX.Element {
  const [
    cameraPermission, setCameraPermission,
  ] = useState<CameraPermissionStatus>();
  const [qrValue, setQRValue] = useState<QRCodeValue>();
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    const setPermissions = async () => {
      setCameraPermission(await Camera.getCameraPermissionStatus());
    };
    setPermissions().catch(console.error);
  }, []);

  useEffect(() => {
    if (qrValue) {
      setCameraEnabled(false);
      onQRCodeValueScanned?.(qrValue);
    }
  }, [qrValue]);

  if (qrValue) {
    if (expectedOrgId) {
      return <ConnectionReview qrValue={qrValue} />;
    }

    return <MembershipReview qrValue={qrValue} />;
  }

  if ((cameraPermission === 'authorized') && cameraEnabled) {
    return (
      <QRCamera
        enabled={cameraEnabled}
        onPress={() => setCameraEnabled(false)}
        onQRValueScanned={(value) => {
          if (expectedOrgId && (expectedOrgId !== value.org.id)) { return; }
          setQRValue(value);
        }}
      />
    );
  }

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

  return (
    <FramedIconPromptButton
      iconName={iconName}
      onPress={onPress}
      prompt={prompt}
    />
  );
}

CameraControl.defaultProps = {
  expectedOrgId: null,
  onQRCodeValueScanned: () => {},
};
