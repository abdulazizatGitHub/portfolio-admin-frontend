export interface ContactInfoItem {
  id?: string;
  type: 'email' | 'phone' | 'location';
  label: string;
  value: string;
  href?: string;
  orderIndex: number;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  orderIndex: number;
}
