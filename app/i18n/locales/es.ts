import type { Translation } from './en';

const translation: Translation = {
  action: {
    contactUs: 'sContact Us',
    create: 'sCreate',
    createOrg: 'Crear Org',
    initializeOrgEmail: 'sAdd Your Email',
    initializeOrgMemberDefinition: 'sDefine Who Can Join',
    initializeOrgName: 'sName Your Org',
    join: 'sJoin',
    joinOrg: 'Unirse a Org',
    learnMore: 'sLearn More',
    navigateBack: 'sBack',
    navigateNext: 'sNext',
    reviewOrg: 'sReview Your Org',
    verify: 'sVerify',
    verifyAccount: 'sVerify Your Account',
  },
  branding: {
    appName: 'Organize',
  },
  email: {
    subject: {
      verificationCodeRequest: 'sOrganize Verification',
    },
  },
  error: {
    cameraNotFound: 'sNo camera found',
  },
  explanation: {
    potentialMemberDefinition: 'sAn Org is strongest and healthiest once it recruits 70% of the people that fit its potential member definition.\n\nIf your definition is too broad, it\'ll be hard to hit 70%. If your definition is too strict, it\'ll be easier to hit 70%, but your Org may be too small to really benefit from "strength in numbers."\n\nThe most common definition is to include every employee at your workplace who isn\'t in management.',
    orgEmail: 'sThe app developers will email this address if they need to contact your Org.\n\nWhether your Org has 10 members or 10,000, this email is the single point of contact for your entire Org.',
    orgName: 'sYou can name your Org anything your want, but usually they\'re called locals. For example, you might name your Org "Local 4286" or "Local 552."',
  },
  format: {
    currentStep: 'sStep {{currentStep}} <SecondaryText>of {{totalSteps}}</SecondaryText>',
    userAgreement: 'sBy tapping {{buttonLabel}}, I agree to the Organize <TermsLink>Terms</TermsLink> and <PrivacyLink>Privacy Policy</PrivacyLink>',
    verificationCodeEmailBody: "sI'd like to create a new Org on the Organize app. Please send me a verification code!\n\nReference ID: {{referenceId}}",
  },
  hint: {
    inputModifiable: 'sYou can change this later',
    scanToJoin: 'sTo join an Org, scan the secret code of a current member.',
  },
  object: {
    email: 'sEmail',
    name: 'sName',
    potentialMemberDefinition: 'sPotential Member Definition',
    verificationCode: 'sCode',
  },
  placeholder: {
    email: 'semail@example.com',
    potentialMemberDefinition: 'sAn employee of *employer* at *location*',
    verificationCode: 's123456',
  },
  question: {
    potentialMemberDefinition: 'sHow do I decide who can join?',
    orgEmail: 'sWhy do you need my email?',
    orgName: 'sWhat should I name my Org?',
    verificationCode: "sDon't have a code yet?",
  },
  valueProposition: 'Crea tu propio sindicato',
};
const es = { translation };
export default es;
