export interface ContactInfoItem {
  id?: number;
  type: 'email' | 'phone' | 'location';
  label: string;
  value: string;
  href?: string;
  orderIndex: number;
}

export interface SocialLink {
  id?: number;
  platform: string;
  url: string;
  orderIndex: number;
}

