import * as Yup from 'yup';

// Personal Content Schema
export const personalContentSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  titlePrefix: Yup.string().required('Title prefix is required'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters'),
  roles: Yup.array()
    .of(Yup.string().required())
    .min(1, 'At least one role is required'),
  cvFilePath: Yup.string().required('CV file path is required'),
  cvDownloadName: Yup.string().required('CV download name is required'),
});

// About Content Schema
export const aboutContentSchema = Yup.object().shape({
  roleTitle: Yup.string().required('Role title is required'),
  paragraphs: Yup.array()
    .of(Yup.string().required())
    .min(1, 'At least one paragraph is required'),
  stats: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required('Label is required'),
        value: Yup.string().required('Value is required'),
      })
    )
    .min(1, 'At least one stat is required'),
});

// Education Schema
export const educationSchema = Yup.object().shape({
  period: Yup.string().required('Period is required'),
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
});

// Experience Schema
export const experienceRoleSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required'),
  startDate: Yup.string()
    .required('Start date is required')
    .matches(/^\d{4}-\d{2}$/, 'Start date must be in YYYY-MM format'),
  endDate: Yup.string()
    .nullable()
    .matches(/^\d{4}-\d{2}$/, 'End date must be in YYYY-MM format'),
  description: Yup.string().required('Description is required'),
  orderIndex: Yup.number().required(),
});

export const experienceSchema = Yup.object().shape({
  organization: Yup.string().required('Organization is required'),
  location: Yup.string().optional(),
  employmentType: Yup.string()
    .oneOf(['full_time', 'part_time', 'contract', 'internship', 'freelance', 'other', ''])
    .optional(),
  summary: Yup.string().optional(),
  // Roles are validated manually in the form component
});

// Skill Schema
export const skillSchema = Yup.object().shape({
  name: Yup.string().required('Skill name is required'),
  level: Yup.number()
    .required('Level is required')
    .min(0, 'Level must be at least 0')
    .max(100, 'Level must be at most 100'),
  category: Yup.string().oneOf(['technical', 'ai'], 'Invalid category').required('Category is required'),
});

// Project Schema
export const projectSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  tech: Yup.array()
    .of(Yup.string().required())
    .min(1, 'At least one technology is required'),
  imagePath: Yup.string().required('Image path is required'),
  liveUrl: Yup.string().url('Must be a valid URL').optional(),
  sourceUrl: Yup.string().url('Must be a valid URL').optional(),
  isPublished: Yup.boolean().required(),
});

// Contact Info Schema
export const contactInfoSchema = Yup.object().shape({
  type: Yup.string().oneOf(['email', 'phone', 'location'], 'Invalid type').required('Type is required'),
  label: Yup.string().required('Label is required'),
  value: Yup.string().required('Value is required'),
  href: Yup.string().url('Must be a valid URL').optional(),
});

// Social Link Schema
export const socialLinkSchema = Yup.object().shape({
  platform: Yup.string().required('Platform is required'),
  url: Yup.string().url('Must be a valid URL').required('URL is required'),
});

