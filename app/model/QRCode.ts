import { fakeJwtString } from './FakeQRCodeValue';
import { Org, QRCodeValue } from './types';
import { UserType } from './User';

export const QR_CODE_TIME_TO_LIVE_MS = 60 * 1000;

type Props = {
  currentTime: number;
  org: Org;
  user: UserType;
};

export default function QRCode({ currentTime, org, user }: Props): QRCodeValue {
  return {
    expiration: currentTime + QR_CODE_TIME_TO_LIVE_MS,
    jwt: fakeJwtString,
    org,
    sharedBy: user,
  };
}
