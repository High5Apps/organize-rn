import React, { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { FramedIconPromptButton, QRCodeButton } from './buttons';
import {
  QRCodeDataFormatter, QR_CODE_TIME_TO_LIVE_SECONDS, useAppState,
  useCurrentUser,
} from '../../model';
import { useTranslation } from '../../i18n';

export default function QRCodeControl() {
  const { currentUser } = useCurrentUser();
  const { t } = useTranslation();

  const [revealed, setRevealed] = useState(false);
  const [qrCodeData, setQRCodeData] = useState<string>('');

  const isFocused = useIsFocused();
  const appState = useAppState();
  if (revealed && (!isFocused || appState !== 'active')) {
    setRevealed(false);
  }

  if (!currentUser) {
    throw new Error('Expected currentUser to be set');
  }

  const refreshedQRCodeData = async () => {
    const currentTime = new Date().getTime();
    const formatter = QRCodeDataFormatter({ currentTime, currentUser });
    return formatter.toString();
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
      prompt={t('hint.tapToRevealCode')}
    />
  );
}
