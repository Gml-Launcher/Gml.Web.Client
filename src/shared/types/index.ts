export type TMenuItem = {
  icon: React.ReactNode;
  text: string;
  path: string;
};

export type SelectOption = {
  label: string;
  value: string;
};

export type NotificationsParams = {
  message: string;
  details: Nullable<string>;
};
