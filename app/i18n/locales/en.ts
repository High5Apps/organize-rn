const en = {
  translation: {
    action: {
      contactUs: 'Contact Us',
      create: 'Create',
      createOrg: 'Create Org',
      initializeOrgEmail: 'Add Your Email',
      initializeOrgMemberDefinition: 'Define Who Can Join',
      initializeOrgName: 'Name Your Org',
      join: 'Join',
      joinOrg: 'Join Org',
      learnMore: 'Learn More',
      navigateBack: 'Back',
      navigateNext: 'Next',
      reviewOrg: 'Review Your Org',
      verify: 'Verify',
      verifyAccount: 'Verify Your Account',
    },
    branding: {
      appName: 'Organize',
    },
    email: {
      subject: {
        verificationCodeRequest: 'Organize Verification',
      },
    },
    error: {
      cameraNotFound: 'No camera found',
    },
    explanation: {
      potentialMemberDefinition: 'An Org is strongest and healthiest once it recruits 70% of the people that fit its potential member definition.\n\nIf your definition is too broad, it\'ll be hard to hit 70%. If your definition is too strict, it\'ll be easier to hit 70%, but your Org may be too small to really benefit from "strength in numbers."\n\nThe most common definition is to include every employee at your workplace who isn\'t in management.',
      orgEmail: 'The app developers will email this address if they need to contact your Org.\n\nWhether your Org has 10 members or 10,000, this email is the single point of contact for your entire Org.',
      orgName: 'You can name your Org anything your want, but usually they\'re called locals. For example, you might name your Org "Local 4286" or "Local 552."',
    },
    format: {
      currentStep: 'Step {{currentStep}} <SecondaryText>of {{totalSteps}}</SecondaryText>',
      userAgreement: 'By tapping {{buttonLabel}}, I agree to the Organize <TermsLink>Terms</TermsLink> and <PrivacyLink>Privacy Policy</PrivacyLink>',
      verificationCodeEmailBody: "I'd like to create a new Org on the Organize app. Please send me a verification code!\n\nReference ID: {{referenceId}}",
    },
    hint: {
      inputModifiable: 'You can change this later',
      scanToJoin: 'To join an Org, scan the secret code of a current member.',
    },
    object: {
      email: 'Email',
      name: 'Name',
      potentialMemberDefinition: 'Potential Member Definition',
      verificationCode: 'Code',
    },
    placeholder: {
      email: 'email@example.com',
      potentialMemberDefinition: 'An employee of *employer* at *location*',
      verificationCode: '123456',
    },
    question: {
      potentialMemberDefinition: 'How do I decide who can join?',
      orgEmail: 'Why do you need my email?',
      orgName: 'What should I name my Org?',
      verificationCode: "Don't have a code yet?",
    },
    valueProposition: 'Form your own labor union',
  },
};
export default en;

type Translation = typeof en['translation'];
export type { Translation };
