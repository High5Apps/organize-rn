import { NewOrgSteps } from '../model';
import {
  NewOrgScreenNavigationProp, NewOrgScreenParams, OrgReviewParams,
} from './types';

const name = 'NewOrg';

const NewOrgStepNavigator = (navigation: NewOrgScreenNavigationProp) => {
  function navigateToStep(step: number, params: NewOrgScreenParams) {
    navigation.navigate(name, { ...params, step });
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
