export type LeadItem = {
  destination: 'EditOrg' | 'Permissions' | 'Moderation' | 'UnionCards';
  iconName: string;
  title: string;
};

export type ModerationItem = {
  destination: 'BlockedMembers' | 'FlagReportTabs';
  iconName: string;
  title: string;
};
