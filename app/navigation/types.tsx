import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type NewOrgScreenParams = {
  definition?: string;
  estimate?: number;
  name?: string;
  step: number;
};

export type OrgReviewParams = Required<Omit<NewOrgScreenParams, 'step'>>;

export type NewOrgParam = keyof OrgReviewParams;

export type WelcomeStackParamList = {
  JoinOrg: undefined;
  NewOrg: NewOrgScreenParams;
  OrgReview: OrgReviewParams;
  Welcome: undefined;
};

export type WelcomeStackScreenProps<T extends keyof WelcomeStackParamList> =
  NativeStackScreenProps<WelcomeStackParamList, T>;

export type WelcomeScreenProps = WelcomeStackScreenProps<'Welcome'>;
export type NewOrgScreenProps = WelcomeStackScreenProps<'NewOrg'>;
export type OrgReviewScreenProps = WelcomeStackScreenProps<'OrgReview'>;
export type JoinOrgScreenProps = WelcomeStackScreenProps<'JoinOrg'>;

export type WelcomeStackNavigationProp = NavigationProp<WelcomeStackParamList>;

// For more info, see
// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends WelcomeStackParamList {}
  }
}
