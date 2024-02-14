import { OfficeDuty } from './types';

const OFFICE_DUTIES: OfficeDuty[] = [
  {
    category: 'president',
    duties: [
      'Leads the Org',
      'Represents the Org in external matters',
      'Works with the other officers to ensure the well-being of the Org',
      'Presides over all meetings',
      'Decides questions of order',
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
      'Guides new members',
      'Advises members during investigatory interviews by management',
      'Listens to members and raises their concerns to other officers',
      'Promotes solidarity among all members',
    ],
  },
  {
    category: 'trustee',
    duties: [
      'Audits the bookkeeping of the Org periodically',
      'Checks the integrity of the treasurer',
    ],
  },
];

export default OFFICE_DUTIES;
