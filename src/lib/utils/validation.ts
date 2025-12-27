import { z } from 'zod';

export const personalContentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  titlePrefix: z.string().min(1, 'Title prefix is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  roles: z.array(z.string().min(1)).min(1, 'At least one role is required'),
  cvFilePath: z.string().min(1, 'CV file path is required'),
  cvDownloadName: z.string().min(1, 'CV download name is required'),
});

export type PersonalContentFormData = z.infer<typeof personalContentSchema>;

