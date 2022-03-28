import NewOrgSteps from './NewOrgSteps';
import { NewOrgScreenParams, RootStackNavigationProp } from './types';

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
        const json = JSON.stringify(params, null, 2);
        console.log(`navigate to review: ${json}`);
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
