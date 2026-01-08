export interface PersonalProfile {
  id?: number;
  name: string;
  titlePrefix: string;
  description: string;
  roles: string[];
  cvFile?: string; // base64 encoded file or URL
  cvFileName?: string;
  cvDownloadName: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy support
export type PersonalContent = PersonalProfile;

