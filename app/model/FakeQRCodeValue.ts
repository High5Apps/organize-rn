import { QRCodeValue } from './types';

type Props = {
  currentTime: number;
  timeToLiveMS: number;
};

export const placeholderOrgId = '99947de7-3fc2-4cd9-8f3c-3fd4a1e9b596';

export default function fakeQRCodeValue({
  currentTime,
  timeToLiveMS,
}: Props): QRCodeValue {
  return {
    expiration: currentTime + timeToLiveMS,
    org: {
      id: placeholderOrgId,
      name: 'Local 9918',
      potentialMemberCount: 218,
      potentialMemberDefinition: 'An employee at Company Store #11235',
    },
    sharedBy: {
      id: 'a9f12113-766c-454d-8ee5-2f5a5effe5b5',
      orgId: placeholderOrgId,
    },
  };
}
