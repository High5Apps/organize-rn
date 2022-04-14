import React, { useEffect, useState } from 'react';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import { QRCodeValue } from '../../model';
import { MembershipReview } from '../views';
import FramedIconPromptButton from './FramedIconPromptButton';
import QRCamera from './QRCamera';

type Props = {
  onQRCodeValueScanned?: (value: QRCodeValue) => void;
};

export default function CameraControl({
  onQRCodeValueScanned,
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
    return <MembershipReview qrValue={qrValue} />;
  }

  if (cameraPermission === 'authorized') {
    return (
      <QRCamera
        enabled={cameraEnabled}
        onQRValueScanned={setQRValue}
      />
    );
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

CameraControl.defaultProps = {
  onQRCodeValueScanned: () => {},
};
