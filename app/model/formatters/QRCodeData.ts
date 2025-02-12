import { useEffect, useState } from 'react';
import type { CurrentUserType } from '../context';
import { base64ToBase64Url, base64UrlToBase64 } from './JWT';
import { isQRCodeValue, type QRCodeValue } from '../types';
import { connectURI } from '../../networking';

export const QR_CODE_TIME_TO_LIVE_SECONDS = 60;
export const QR_CODE_JWT_SCOPE = 'create:connections';

const JWT_PARAM = 'jwt';
const GROUP_KEY_PARAM = 'gk';

type FormatterProps = {
  currentTime: number;
  currentUser: CurrentUserType;
};

export function QRCodeDataFormatter({
  currentTime, currentUser,
}: FormatterProps) {
  async function toString(): Promise<string> {
    if (!currentUser) {
      throw new Error('Expected QRCode user to be the current user');
    }

    const [jwtString, base64GroupKey] = await Promise.all([
      currentUser.createAuthToken({
        currentTime,
        timeToLiveSeconds: QR_CODE_TIME_TO_LIVE_SECONDS,
        scope: QR_CODE_JWT_SCOPE,
      }),
      currentUser.decryptGroupKey(),
    ]);

    const base64UrlGroupKey = base64ToBase64Url(base64GroupKey);

    const url = new URL(connectURI);
    const searchParams = new URLSearchParams();
    searchParams.set(JWT_PARAM, jwtString);
    searchParams.set(GROUP_KEY_PARAM, base64UrlGroupKey);

    // Using hash params ensures that the group key can't be sent to the backend
    url.hash = searchParams.toString();

    return url.href;
  }

  return { toString };
}

type GetQRValueProps = {
  base64UrlGroupKey?: string | null;
  jwt?: string | null;
};

type ParseProps = {
  input: string;
};

export function QRCodeDataParser() {
  function getQRValue({
    base64UrlGroupKey, jwt,
  }: GetQRValueProps): QRCodeValue | null {
    if (!jwt || !base64UrlGroupKey) {
      return null;
    }

    const groupKey = base64UrlToBase64(base64UrlGroupKey);

    const value = { groupKey, jwt };

    if (!isQRCodeValue(value)) {
      console.warn('QRCodeDataParser failure: Missing expected data');
      return null;
    }

    return value;
  }

  function parse({ input }: ParseProps): QRCodeValue | null {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(input);
    } catch {
      console.warn(`Failed to parse url from: ${input}`);
      return null;
    }

    const paramsWithoutHashSign = parsedUrl.hash.slice(1);
    const searchParams = new URLSearchParams(paramsWithoutHashSign);
    const jwt = searchParams.get(JWT_PARAM);
    const base64UrlGroupKey = searchParams.get(GROUP_KEY_PARAM);
    return getQRValue({ base64UrlGroupKey, jwt });
  }

  return { getQRValue, parse };
}

export type QRValueRouteParams = {
  jwt: string;
  gk: string;
};

export function useQRValue(routeParams: QRValueRouteParams | undefined) {
  const { gk: base64UrlGroupKey, jwt } = routeParams ?? {};

  const [qrValue, setQRValue] = useState<QRCodeValue | null>(
    QRCodeDataParser().getQRValue({ base64UrlGroupKey, jwt }),
  );

  useEffect(() => {
    setQRValue(QRCodeDataParser().getQRValue({ base64UrlGroupKey, jwt }));
  }, [base64UrlGroupKey, jwt]);

  return [qrValue, setQRValue] as const;
}
