import React, { useState } from 'react';
import FramedIconPromptButton from './FramedIconPromptButton';
import QRCodeButton from './QRCodeButtton';

export default function QRCodeControl() {
  const [revealed, setRevealed] = useState(false);

  if (revealed) {
    return <QRCodeButton onPress={() => setRevealed(false)} />;
  }
  return (
    <FramedIconPromptButton
      iconName="qr-code-2"
      onPress={() => setRevealed(true)}
      prompt={'Tap to reveal\nyour secret code'}
    />
  );
}
