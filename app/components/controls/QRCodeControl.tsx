import React, { useState } from 'react';
import FramedIconPromptButton from './FramedIconPromptButton';
import QRCodeButton from './QRCodeButtton';
import {
  QRCode, QRCodeValue, QR_CODE_TIME_TO_LIVE_MS, useUserContext,
} from '../../model';

export default function QRCodeControl() {
  const { currentUser } = useUserContext();

  if (!currentUser) {
    throw new Error('Expected currentUser to be set in QRCode');
  }

  const { org } = currentUser;

  if (!org) {
    throw new Error('Expected currentUser to have org in QRCode');
  }

  const currentTime = new Date().getTime();
  const refreshedQRCode = () => QRCode({ currentTime, org, user: currentUser });

  const [revealed, setRevealed] = useState(false);
  const [
    qrCodeData, setQRCodeData,
  ] = useState<QRCodeValue>(refreshedQRCode());

  if (revealed) {
    return (
      <QRCodeButton
        onPress={() => setRevealed(false)}
        onTimeout={() => setRevealed(false)}
        qrCodeValue={qrCodeData}
        timeout={QR_CODE_TIME_TO_LIVE_MS / 2}
      />
    );
  }
  return (
    <FramedIconPromptButton
      iconName="qr-code-2"
      onPress={() => {
        setQRCodeData(refreshedQRCode());
        setRevealed(true);
      }}
      prompt={'Tap to reveal\nyour secret code'}
    />
  );
}
