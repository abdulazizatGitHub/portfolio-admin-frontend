import { z } from 'zod';

// Education Schema
export const educationSchema = z.object({
  period: z.string().min(1, 'Period is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

// Experience Schema
export const experienceSchema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  location: z.string().optional(),
  employmentType: z
    .enum(['full_time', 'part_time', 'contract', 'internship', 'freelance', 'other', ''])
    .optional(),
  summary: z.string().optional(),
  // Roles are validated manually in the form component
});

// Contact Info Schema
export const contactInfoSchema = z.object({
  type: z.enum(['email', 'phone', 'location'], { message: 'Invalid type' }),
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  href: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Social Link Schema
export const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Must be a valid URL').min(1, 'URL is required'),
});
