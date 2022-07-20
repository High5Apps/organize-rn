import JWT, { JWTParser } from './JWT';
import Keys from './Keys';
import {
  isCurrentUserData, isQRCodeValue, Org, QRCodeValue,
} from './types';
import { UserType } from './User';

export const QR_CODE_TIME_TO_LIVE_SECONDS = 60;
export const BASE_URL = 'https://getorganize.app';
const JWT_PARAM = 'jwt';
const ORG_NAME_PARAM = 'org_name';
const ORG_POTENTIAL_MEMBER_COUNT_PARAM = 'org_potential_member_count';
const ORG_POTENTIAL_MEMBER_DEFINITION_PARAM = 'org_potential_member_definition';

type FormatterProps = {
  currentTime: number;
  org: Org;
  currentUser: UserType;
};

export function QRCodeDataFormatter({
  currentTime, org, currentUser,
}: FormatterProps) {
  async function toUrl(): Promise<string> {
    if (!isCurrentUserData(currentUser)) {
      throw new Error('Expected QRCode user to be the current user');
    }

    const signer = (
      { message }: { message: string },
    ) => Keys().rsa.sign({ message, publicKeyId: currentUser.publicKeyId });

    const expirationSecondsSinceEpoch = (
      (currentTime / 1000) + QR_CODE_TIME_TO_LIVE_SECONDS
    );

    const jwt = JWT({
      expirationSecondsSinceEpoch,
      signer,
      subject: currentUser.id,
    });

    const jwtString = await jwt.toString();
    const url = new URL(`${BASE_URL}/orgs/${org.id}/connections`);
    url.searchParams.set(JWT_PARAM, jwtString);
    url.searchParams.set(ORG_NAME_PARAM, org.name);
    url.searchParams.set(
      ORG_POTENTIAL_MEMBER_COUNT_PARAM,
      org.potentialMemberCount.toString(),
    );
    url.searchParams.set(
      ORG_POTENTIAL_MEMBER_DEFINITION_PARAM,
      org.potentialMemberDefinition,
    );

    return url.href;
  }

  return { toUrl };
}

type ParserProps = {
  url: string;
};

export function QRCodeDataParser({ url }: ParserProps) {
  function parse(): QRCodeValue | null {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (_) {
      console.warn(`Failed to parse url from: ${url}`);
      return null;
    }

    const { origin, pathname, searchParams } = parsedUrl;

    if (origin !== BASE_URL) {
      console.warn(`Unexpected origin: ${origin}`);
      return null;
    }

    const jwt = searchParams.get(JWT_PARAM);

    const orgId = pathname.split('/')[2];
    const name = searchParams.get(ORG_NAME_PARAM);
    const potentialMemberCountString = searchParams.get(
      ORG_POTENTIAL_MEMBER_COUNT_PARAM,
    );
    const potentialMemberCount = parseInt(potentialMemberCountString || '', 10);
    const potentialMemberDefinition = searchParams.get(
      ORG_POTENTIAL_MEMBER_DEFINITION_PARAM,
    );
    const org = {
      id: orgId, name, potentialMemberCount, potentialMemberDefinition,
    };

    const { expiration, subject: userId } = JWTParser(jwt);
    const sharedBy = { id: userId, orgId };

    const value = {
      expiration, jwt, org, sharedBy,
    };

    if (!isQRCodeValue(value)) {
      console.warn('QRCodeDataParser failure: Missing expected data');
      return null;
    }

    return value;
  }

  return { parse };
}
