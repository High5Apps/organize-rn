import { NewOrgSteps } from '../../../model';
import type {
  NewOrgScreenNavigationProp, NewOrgScreenParams, OrgReviewParams,
} from '../../../navigation';

const name = 'NewOrg';

const NewOrgStepNavigator = (navigation: NewOrgScreenNavigationProp) => ({
  navigateToNext: (currentStep: number, params: NewOrgScreenParams) => {
    if (currentStep < NewOrgSteps.length - 1) {
      navigation.navigate(name, { ...params, step: currentStep + 1 });
    } else {
      navigation.navigate({
        name: 'OrgReview',
        params: (params as OrgReviewParams),
      });
    }
  },
  navigateToPrevious: (currentStep: number, params: NewOrgScreenParams) => {
    if (currentStep > 0) {
      navigation.popTo(name, { ...params, step: currentStep - 1 });
    } else {
      navigation.goBack();
    }
  },
});

export default NewOrgStepNavigator;

export type NewOrgStepNavigatorType = ReturnType<typeof NewOrgStepNavigator>;
