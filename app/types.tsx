import { NavigationProp } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type NewOrgScreenParams = {
  definition?: string;
  estimate?: number;
  name?: string;
  step: number;
};

export type RootStackParamList = {
  Welcome: undefined;
  NewOrg: NewOrgScreenParams;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type WelcomeScreenProps = RootStackScreenProps<'Welcome'>;
export type NewOrgScreenProps = RootStackScreenProps<'NewOrg'>;

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;

// For more info, see
// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
