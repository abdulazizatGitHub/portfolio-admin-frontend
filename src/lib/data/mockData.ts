import type {
  PersonalContent,
  AboutContent,
  EducationEntry,
  ExperienceEntry,
  Skill,
  Project,
  ContactInfoItem,
  SocialLink,
} from '@/types';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockPersonalContent: PersonalContent = {
  name: 'John Doe',
  titlePrefix: "Hi, I'm",
  description:
    'A passionate full-stack developer with expertise in modern web technologies. I love building scalable applications and solving complex problems.',
  roles: ['Full Stack Developer', 'UI/UX Designer', 'Tech Enthusiast'],
  cvFilePath: '/documents/cv.pdf',
  cvDownloadName: 'John_Doe_CV.pdf',
};

export const mockAboutContent: AboutContent = {
  roleTitle: 'Full Stack Developer',
  paragraphs: [
    'I am a dedicated software developer with over 5 years of experience in building web applications.',
    'My passion lies in creating user-friendly interfaces and robust backend systems.',
    'I enjoy working with modern technologies and staying up-to-date with industry trends.',
  ],
  stats: [
    { label: 'CGPA', value: '3.8/4.0' },
    { label: 'Projects', value: '50+' },
    { label: 'Experience', value: '5 Years' },
  ],
};

export const mockEducation: EducationEntry[] = [
  {
    id: 1,
    period: '2018 - 2022',
    title: 'Bachelor of Science in Computer Science',
    description: 'Graduated with honors. Focused on software engineering and web development.',
    orderIndex: 0,
  },
  {
    id: 2,
    period: '2016 - 2018',
    title: 'High School Diploma',
    description: 'Completed with distinction in Mathematics and Computer Science.',
    orderIndex: 1,
  },
];

export const mockExperience: ExperienceEntry[] = [
  {
    id: 1,
    period: '2022 - Present',
    title: 'Senior Full Stack Developer',
    description:
      'Leading development of multiple web applications using React, Node.js, and cloud technologies.',
    orderIndex: 0,
  },
  {
    id: 2,
    period: '2020 - 2022',
    title: 'Full Stack Developer',
    description:
      'Developed and maintained web applications, collaborated with cross-functional teams.',
    orderIndex: 1,
  },
  {
    id: 3,
    period: '2018 - 2020',
    title: 'Junior Developer',
    description: 'Started my career working on frontend development and learning backend technologies.',
    orderIndex: 2,
  },
];

export const mockSkills: Skill[] = [
  // Technical Skills
  { id: 1, name: 'JavaScript', level: 95, category: 'technical', orderIndex: 0 },
  { id: 2, name: 'TypeScript', level: 90, category: 'technical', orderIndex: 1 },
  { id: 3, name: 'React', level: 92, category: 'technical', orderIndex: 2 },
  { id: 4, name: 'Node.js', level: 88, category: 'technical', orderIndex: 3 },
  { id: 5, name: 'Python', level: 85, category: 'technical', orderIndex: 4 },
  { id: 6, name: 'SQL', level: 80, category: 'technical', orderIndex: 5 },
  // AI/ML Skills
  { id: 7, name: 'Machine Learning', level: 75, category: 'ai', orderIndex: 0 },
  { id: 8, name: 'Deep Learning', level: 70, category: 'ai', orderIndex: 1 },
  { id: 9, name: 'TensorFlow', level: 72, category: 'ai', orderIndex: 2 },
  { id: 10, name: 'PyTorch', level: 68, category: 'ai', orderIndex: 3 },
];

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description:
      'A full-stack e-commerce platform with payment integration, user authentication, and admin dashboard.',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    imagePath: '/images/project1.jpg',
    liveUrl: 'https://example.com',
    sourceUrl: 'https://github.com/example/ecommerce',
    orderIndex: 0,
    isPublished: true,
  },
  {
    id: 2,
    title: 'Task Management App',
    description:
      'A collaborative task management application with real-time updates and team collaboration features.',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL', 'WebSockets'],
    imagePath: '/images/project2.jpg',
    liveUrl: 'https://example.com/tasks',
    sourceUrl: 'https://github.com/example/tasks',
    orderIndex: 1,
    isPublished: true,
  },
  {
    id: 3,
    title: 'AI Image Classifier',
    description:
      'Machine learning model for image classification using convolutional neural networks.',
    tech: ['Python', 'TensorFlow', 'Keras', 'Flask'],
    imagePath: '/images/project3.jpg',
    sourceUrl: 'https://github.com/example/ai-classifier',
    orderIndex: 2,
    isPublished: false,
  },
];

export const mockContactInfo: ContactInfoItem[] = [
  {
    id: 1,
    type: 'email',
    label: 'Email',
    value: 'john.doe@example.com',
    href: 'mailto:john.doe@example.com',
    orderIndex: 0,
  },
  {
    id: 2,
    type: 'phone',
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
    orderIndex: 1,
  },
  {
    id: 3,
    type: 'location',
    label: 'Location',
    value: 'New York, USA',
    orderIndex: 2,
  },
];

export const mockSocialLinks: SocialLink[] = [
  {
    id: 1,
    platform: 'LinkedIn',
    url: 'https://linkedin.com/in/johndoe',
    orderIndex: 0,
  },
  {
    id: 2,
    platform: 'GitHub',
    url: 'https://github.com/johndoe',
    orderIndex: 1,
  },
  {
    id: 3,
    platform: 'Twitter',
    url: 'https://twitter.com/johndoe',
    orderIndex: 2,
  },
];

// Mock API functions with delays
export const fetchPersonalContent = async (): Promise<PersonalContent> => {
  await delay(500);
  return mockPersonalContent;
};

export const fetchAboutContent = async (): Promise<AboutContent> => {
  await delay(500);
  return mockAboutContent;
};

export const fetchEducation = async (): Promise<EducationEntry[]> => {
  await delay(500);
  return mockEducation;
};

export const fetchExperience = async (): Promise<ExperienceEntry[]> => {
  await delay(500);
  return mockExperience;
};

export const fetchSkills = async (): Promise<Skill[]> => {
  await delay(500);
  return mockSkills;
};

export const fetchProjects = async (): Promise<Project[]> => {
  await delay(500);
  return mockProjects;
};

export const fetchContactInfo = async (): Promise<ContactInfoItem[]> => {
  await delay(500);
  return mockContactInfo;
};

export const fetchSocialLinks = async (): Promise<SocialLink[]> => {
  await delay(500);
  return mockSocialLinks;
};

