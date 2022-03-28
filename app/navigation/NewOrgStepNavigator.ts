import { NewOrgSteps } from '../model';
import {
  NewOrgScreenParams, OrgReviewParams, RootStackNavigationProp,
} from './types';

const name = 'NewOrg';

const NewOrgStepNavigator = (navigation: RootStackNavigationProp) => {
  function navigateToStep(step: number, params?: NewOrgScreenParams) {
    navigation.navigate({
      key: `${name}${step}`,
      name,
      params: {
        ...params,
        step,
      },
    });
  }

  return {
    navigateToStep,
    navigateToNext: (currentStep: number, params: NewOrgScreenParams) => {
      if (currentStep < NewOrgSteps.length - 1) {
        navigateToStep(currentStep + 1, params);
      } else {
        navigation.navigate({
          name: 'OrgReview',
          params: (params as OrgReviewParams),
        });
      }
    },
    navigateToPrevious: (currentStep: number, params: NewOrgScreenParams) => {
      if (currentStep > 0) {
        navigateToStep(currentStep - 1, params);
      } else {
        navigation.goBack();
      }
    },
  };
};

export default NewOrgStepNavigator;

export type NewOrgStepNavigatorType = ReturnType<typeof NewOrgStepNavigator>;
