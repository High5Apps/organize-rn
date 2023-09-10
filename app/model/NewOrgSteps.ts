import type { NewOrgParam, NewOrgScreenParams } from '../navigation';

type NewOrgStep = {
  body: string,
  headline: string,
  iconName: string,
  maxLength: number,
  message?: string | ((params: NewOrgScreenParams) => string),
  param: NewOrgParam,
  paramType: 'number' | 'string',
  placeholder: string,
  title: string,
};

const NewOrgSteps: NewOrgStep[] = [
  {
    body: 'You can name your Org anything your want, but usually they\'re called locals. For example, you might name your Org "Local 4286" or "Local 552."',
    headline: 'What should I name my Org?',
    iconName: 'badge',
    maxLength: 35,
    message: "Don't worry- you can change the info in any of these steps later.",
    param: 'name',
    paramType: 'string',
    placeholder: 'Name',
    title: 'Name Your Org',
  },
  {
    body: 'An Org is strongest and healthiest once it\'s recruited 70% of the people that fit its potential member definition.\n\nIf your definition is too broad, it\'ll be hard to hit 70%. If your definition is too strict, it\'ll be easier to hit 70%, but your Org may be too small to really benefit from "strength in numbers."\n\nThe most common definition is to include every employee at your workplace who isn\'t in management.',
    headline: 'How should I define my potential members?',
    iconName: 'menu-book',
    maxLength: 75,
    message: 'Choose the broadest definition that still allows you to recruit at least 70% of all potential members.',
    param: 'definition',
    paramType: 'string',
    placeholder: 'Definition',
    title: 'Define a Potential Member',
  },
];

export default NewOrgSteps;
