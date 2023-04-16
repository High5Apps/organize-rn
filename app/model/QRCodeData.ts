import { orgConnectionsURI, origin } from '../networking';
import { JWTParser } from './JWT';
import {
  isCurrentUserData, isQRCodeValue, Org, QRCodeValue,
} from './types';
import { UserType } from './User';

export const QR_CODE_TIME_TO_LIVE_SECONDS = 60;
export const QR_CODE_JWT_SCOPE = 'create:connections';
const JWT_PARAM = 'jwt';
const ORG_NAME_PARAM = 'org_name';
const ORG_POTENTIAL_MEMBER_COUNT_PARAM = 'org_potential_member_count';
const ORG_POTENTIAL_MEMBER_DEFINITION_PARAM = 'org_potential_member_definition';
const USER_PSEUDONYM = 'user_pseudonym';

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

    const jwtString = await currentUser.createAuthToken({
      currentTime,
      timeToLiveSeconds: QR_CODE_TIME_TO_LIVE_SECONDS,
      scope: QR_CODE_JWT_SCOPE,
    });

    const url = new URL(orgConnectionsURI(org.id));
    url.searchParams.set(JWT_PARAM, jwtString);
    url.searchParams.set(ORG_NAME_PARAM, org.name);
    url.searchParams.set(
      ORG_POTENTIAL_MEMBER_COUNT_PARAM,
      org.potentialMemberEstimate.toString(),
    );
    url.searchParams.set(
      ORG_POTENTIAL_MEMBER_DEFINITION_PARAM,
      org.potentialMemberDefinition,
    );
    url.searchParams.set(USER_PSEUDONYM, currentUser.pseudonym);

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

    const { origin: parsedOrigin, pathname, searchParams } = parsedUrl;

    if (parsedOrigin !== origin) {
      console.warn(`Unexpected origin: ${parsedOrigin}`);
      return null;
    }

    const jwt = searchParams.get(JWT_PARAM);

    const pathComponents = pathname.split('/');
    const orgId = pathComponents[pathComponents.length - 2];
    const name = searchParams.get(ORG_NAME_PARAM);
    const potentialMemberEstimateString = searchParams.get(
      ORG_POTENTIAL_MEMBER_COUNT_PARAM,
    );
    const potentialMemberEstimate = parseInt(
      potentialMemberEstimateString || '',
      10,
    );
    const potentialMemberDefinition = searchParams.get(
      ORG_POTENTIAL_MEMBER_DEFINITION_PARAM,
    );
    const org = {
      id: orgId, name, potentialMemberEstimate, potentialMemberDefinition,
    };

    const pseudonym = searchParams.get(USER_PSEUDONYM);

    const { expiration, subject: userId } = JWTParser(jwt);
    const sharedBy = { id: userId, orgId, pseudonym };

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
