import { QRCodeValue } from './types';

type Props = {
  currentTime: number;
  timeToLiveMS: number;
};

export const placeholderOrgId = '99947de7-3fc2-4cd9-8f3c-3fd4a1e9b596';
export const fakeJwtString = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYjc4YmRkYi1mY2FlLTQ1MGQtOGQ4MC00MDdjMDQ3YjI1NDciLCJleHAiOjE2NTc2MDU2NzkuNzE4fQ.ixM2MAN55YKyLDri3evH-Fr9dq36bpa7PpnNNKqcZlj9Q-Cp2fzu958nr-80MJZLAR_UIq37LFqHSJA2b3-P_WBvVc_YBiONhIXvgyFfhnpBAClPLtGojEN9bUIX78NkptjnHTzfS_RmLbc6sxBgcDDVP1wVl6FcUnHx5fIs2TkSzKGu74gGLP58xXbMxU7kA8EKza3jQzLMLdqjGP_54hmfONAwAJdpV46ywv6Gy-Q5-lJh0dUIKS8JuXUxc89jrBwhnlsfIMoJhto20xI_mvnN2t8WXsSgcULjwuQyfrPR1nM4UB9_XlKmkItJQINfnhIllszy0rwGMUF4B3V-_Q';
export const fakeJwtExpiration = 1657605679.718;
export const fakeJwtSubject = 'eb78bddb-fcae-450d-8d80-407c047b2547';

export default function fakeQRCodeValue({
  currentTime,
  timeToLiveMS,
}: Props): QRCodeValue {
  return {
    expiration: currentTime + timeToLiveMS,
    jwt: fakeJwtString,
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
