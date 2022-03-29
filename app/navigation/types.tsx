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

export type RootStackParamList = {
  JoinOrg: undefined;
  NewOrg: NewOrgScreenParams;
  OrgReview: OrgReviewParams;
  Welcome: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type WelcomeScreenProps = RootStackScreenProps<'Welcome'>;
export type NewOrgScreenProps = RootStackScreenProps<'NewOrg'>;
export type OrgReviewScreenProps = RootStackScreenProps<'OrgReview'>;
export type JoinOrgScreenProps = RootStackScreenProps<'JoinOrg'>;

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

// For more info, see
// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
