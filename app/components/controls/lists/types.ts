export type LeadItem = {
  destination: 'EditOrg' | 'Permissions' | 'Moderation';
  iconName: string;
  title: string;
};

export type ModerationItem = {
  destination: 'BlockedMembers' | 'FlagReportTabs';
  iconName: string;
  title: string;
};
