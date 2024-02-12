import { OfficeDuty } from './types';

const OFFICE_DUTIES: OfficeDuty[] = [
  {
    category: 'president',
    duties: [
      'Leads the Org',
      'Presides over all meetings and decides questions of order',
      'Represents the Org in external matters',
      'Works with the other officers to ensure the well-being of the Org',
      'Can remove members from the Org',
      'Must not have been convicted of—or served a prison sentence for—a serious criminal act in the last 13 years. This also applies to all officers below.',
    ],
  },
  {
    category: 'vice_president',
    duties: [
      'Supports the president',
      "Acts as president in the president's absense",
    ],
  },
  {
    category: 'secretary',
    duties: [
      'Records and reports minutes on the proceedings of all meetings',
      "Keeps the Org's records up-to-date",
    ],
  },
  {
    category: 'treasurer',
    duties: [
      'Handles the financial matters of the Org',
      'Approves spending and reimbursements',
    ],
  },
  {
    category: 'steward',
    duties: [
      'Listens to members and raises their concerns to other officers',
      'Guides new members',
      'Promotes solidarity among all members',
      'Holds a protected legal status under the National Labor Relations Act',
      'Can request from management any business documents, data, or facts that are relevant to grievances',
      'Can represent and offer assistance to members duing investigatory interviews by management',
      'Legally considered equals with management when acting as a representative for members',
      'Legally cannot be held to higher disciplinary standards by management than regular members',
      'Legally cannot be threatened or punished by management for performing these duties',
    ],
  },
  {
    category: 'trustee',
    duties: [
      'Ensures the integrity of the treasurer',
      'Audits the bookkeeping of the Org periodically',
      'Must be independent enough from the treasurer to not have a conflict of interest',
    ],
  },
];

export default OFFICE_DUTIES;
