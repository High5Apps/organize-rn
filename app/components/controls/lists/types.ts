type LeadItemDestination = 'EditOrg' | 'EditWorkGroups' | 'Permissions'
  | 'Moderation' | 'UnionCards';

export type LeadItem = {
  destination: LeadItemDestination;
  iconName: string;
  title: string;
};

export type ModerationItem = {
  destination: 'BlockedMembers' | 'FlagReportTabs';
  iconName: string;
  title: string;
};
