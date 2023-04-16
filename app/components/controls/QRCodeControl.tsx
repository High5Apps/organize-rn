import React, { useState } from 'react';
import FramedIconPromptButton from './FramedIconPromptButton';
import QRCodeButton from './QRCodeButtton';
import {
  QRCodeDataFormatter, QR_CODE_TIME_TO_LIVE_SECONDS, useUserContext,
} from '../../model';

export default function QRCodeControl() {
  const { currentUser } = useUserContext();

  const [revealed, setRevealed] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<string>('');

  if (!currentUser) {
    throw new Error('Expected currentUser to be set');
  }

  const refreshedQRCodeData = async () => {
    const currentTime = new Date().getTime();
    const formatter = QRCodeDataFormatter({ currentTime, currentUser });
    return formatter.toUrl();
  };

  if (revealed) {
    return (
      <QRCodeButton
        onPress={() => setRevealed(false)}
        onTimeout={() => setRevealed(false)}
        qrCodeValue={qrCodeData}
        timeout={(1000 * QR_CODE_TIME_TO_LIVE_SECONDS) / 2}
      />
    );
  }
  return (
    <FramedIconPromptButton
      iconName="qr-code-2"
      onPress={async () => {
        const data = await refreshedQRCodeData();
        setQRCodeData(data);
        setRevealed(true);
      }}
      prompt={'Tap to reveal\nyour secret code'}
    />
  );
}
