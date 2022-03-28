import { NewOrgParam } from '../navigation';

type NewOrgStep = {
  body: string,
  headline: string,
  iconName: string,
  maxLength: number,
  message: string,
  param: NewOrgParam,
  paramType: 'number' | 'string',
  placeholder: string,
  title: string,
};

const NewOrgSteps: NewOrgStep[] = [
  {
    body: 'You can name your Org anything your want, but traditionally unions are called "locals." For example you might name your Org "Local 4286" or "Local 552."',
    headline: "What's in a name?",
    iconName: 'badge',
    maxLength: 35,
    message: "Don't worry- you can change the info in any of these steps later.",
    param: 'name',
    paramType: 'string',
    placeholder: 'Name',
    title: 'Name Your Org',
  },
  {
    body: 'An Org must recruit at least 30% of the people that fit its potential member definition before it can legally vote to form a union.\n\nIf your definition is too broad, it\'ll be hard to hit 30%. If your definition is too strict, you\'ll easily hit 30%, but your Org will be too small to benefit from "strength in numbers."\n\nThe most common definition is to include every employee at your store. And remember that management can\'t legally join a union, so you don\'t need to exclude them in your definition.',
    headline: "It's your defining moment!",
    iconName: 'menu-book',
    maxLength: 75,
    message: 'Choose the broadest definition that still allows you to recruit at least 30% of all potential members.',
    param: 'definition',
    paramType: 'string',
    placeholder: 'Definition',
    title: 'Define a Potential Member',
  },
  {
    body: 'Organize tracks your progress toward recruiting every potential member.\n\nOnce you hit 30%, your Org can legally vote to form a union.\n\nOnce you hit 50%, your Org is unstoppable! You can legally form a union without even needing to vote.',
    headline: 'Count me in!',
    iconName: 'groups',
    maxLength: 5,
    message: 'How many people fit the definition of "an employee at Compnay Store #11235?"',
    param: 'estimate',
    paramType: 'number',
    placeholder: 'Estimate',
    title: 'Estimate Potential Member Count',
  },
];

export default NewOrgSteps;
