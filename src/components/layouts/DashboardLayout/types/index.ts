export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  children?: MenuItem[];
  path?: string;
}

export interface MenuGroup {
  title?: string;
  items: MenuItem[];
  type?: 'group';
}
