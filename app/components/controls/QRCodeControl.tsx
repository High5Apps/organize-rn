import React, { useState } from 'react';
import FramedIconPromptButton from './FramedIconPromptButton';
import QRCodeButton from './QRCodeButtton';
import { FakeQRCodeValue, QRCodeValue } from '../../model';

const TIME_TO_LIVE_MS = 60 * 1000;

export default function QRCodeControl() {
  const refreshedFakeQRCodeData = () => FakeQRCodeValue({
    currentTime: new Date().getTime(),
    timeToLiveMS: TIME_TO_LIVE_MS,
  });

  const [revealed, setRevealed] = useState(false);
  const [
    qrCodeData, setQRCodeData,
  ] = useState<QRCodeValue>(refreshedFakeQRCodeData());

  if (revealed) {
    return (
      <QRCodeButton
        onPress={() => setRevealed(false)}
        onTimeout={() => setRevealed(false)}
        qrCodeValue={qrCodeData}
        timeout={30000}
      />
    );
  }
  return (
    <FramedIconPromptButton
      iconName="qr-code-2"
      onPress={() => {
        setQRCodeData(refreshedFakeQRCodeData());
        setRevealed(true);
      }}
      prompt={'Tap to reveal\nyour secret code'}
    />
  );
}
