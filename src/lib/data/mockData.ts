import type {
  PersonalProfile,
  PersonalContent,
  AboutSection,
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

// Default Fallback Content
export const DEFAULT_ABOUT_SECTION: AboutSection = {
  id: 0,
  roleTitle: 'Software Architect',
  paragraphs: [
    'I am a results-driven professional with a strong background in building scalable web applications and distributed systems.',
    'I focus on writing clean, maintainable code and providing exceptional user experiences through modern technology.',
  ],
  stats: [
    { label: 'Experience', value: '5+ Years' },
    { label: 'Projects', value: '25+' },
    { label: 'Rating', value: '5.0' },
  ],
  orderIndex: 0,
};

export const DEFAULT_EDUCATION: EducationEntry = {
  id: 0,
  period: '2018 - 2022',
  title: 'Bachelor of Science in Computer Science',
  description: 'Specialized in Software Engineering and Artificial Intelligence. Graduated with honors and received multiple academic awards.',
  orderIndex: 0,
};

export const DEFAULT_EXPERIENCE: ExperienceEntry = {
  id: 0,
  organization: 'Tech Innovations Corp',
  location: 'Remote',
  employmentType: 'full_time',
  summary: 'Driving digital transformation and leading the development of high-performance cloud applications.',
  overallPeriod: 'Jan 2022 – Present',
  roles: [
    {
      id: 'default-role-0',
      jobTitle: 'Senior Full Stack Developer',
      startDate: '2022-01',
      endDate: null,
      isCurrent: true,
      description: 'Architecting and implementing mission-critical features using React and Node.js. Optimizing system performance and mentoring junior developers.',
      orderIndex: 0,
    }
  ],
  orderIndex: 0,
};

export const mockPersonalProfiles: PersonalProfile[] = [
  {
    id: 1,
    name: 'John Doe',
    titlePrefix: "Hi, I'm",
    description:
      'A passionate full-stack developer with expertise in modern web technologies. I love building scalable applications and solving complex problems.',
    roles: ['Full Stack Developer', 'UI/UX Designer', 'Tech Enthusiast'],
    cvFile: '',
    cvFileName: 'John_Doe_CV.pdf',
    cvDownloadName: 'John_Doe_CV.pdf',
    isDefault: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-08T12:00:00Z',
  },
  {
    id: 2,
    name: 'John D.',
    titlePrefix: "Hello, I'm",
    description:
      'An experienced UI/UX designer passionate about creating beautiful and intuitive user experiences. I specialize in user-centered design and modern design systems.',
    roles: ['UI/UX Designer', 'Product Designer', 'Design Systems Specialist'],
    cvFile: '',
    cvFileName: 'John_D_Design_Portfolio.pdf',
    cvDownloadName: 'John_D_Design_Portfolio.pdf',
    isDefault: false,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-07T14:30:00Z',
  },
  {
    id: 3,
    name: 'J. Doe',
    titlePrefix: "Welcome, I'm",
    description:
      'A tech consultant and advisor helping businesses leverage modern technologies for growth. I provide strategic guidance on digital transformation and software architecture.',
    roles: ['Tech Consultant', 'Software Architect', 'Business Advisor'],
    cvFile: '',
    cvFileName: 'J_Doe_Consulting_Resume.pdf',
    cvDownloadName: 'J_Doe_Consulting_Resume.pdf',
    isDefault: false,
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-06T16:00:00Z',
  },
];

// Legacy support - return default profile
export const mockPersonalContent: PersonalContent = mockPersonalProfiles.find(p => p.isDefault) || mockPersonalProfiles[0];

export const mockAboutSections: AboutSection[] = [
  {
    id: 1,
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
    orderIndex: 0,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-08T12:00:00Z',
  },
  {
    id: 2,
    roleTitle: 'UI/UX Designer',
    paragraphs: [
      'As a UI/UX designer, I specialize in creating beautiful and intuitive user interfaces.',
      'I have a keen eye for design details and understand the importance of user-centered design principles.',
    ],
    stats: [
      { label: 'Design Tools', value: 'Figma, Adobe XD' },
      { label: 'UI Projects', value: '30+' },
    ],
    orderIndex: 1,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-07T14:30:00Z',
  },
  {
    id: 3,
    roleTitle: 'Tech Enthusiast',
    paragraphs: [
      'I am passionate about technology and love exploring new frameworks, tools, and methodologies. Continuous learning is at the core of my professional development.',
    ],
    stats: [
      { label: 'GitHub Stars', value: '1.2K' },
      { label: 'Open Source', value: 'Active' },
      { label: 'Blog Posts', value: '25+' },
      { label: 'Tech Talks', value: '10+' },
    ],
    orderIndex: 2,
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-06T16:00:00Z',
  },
  {
    id: 4,
    roleTitle: 'Team Leader',
    paragraphs: [
      'With experience leading development teams, I understand the importance of clear communication and collaboration.',
      'I focus on mentoring junior developers and fostering a positive team culture.',
    ],
    stats: [
      { label: 'Team Size', value: '8 Members' },
      { label: 'Projects Led', value: '15+' },
    ],
    orderIndex: 3,
    createdAt: '2024-01-04T10:00:00Z',
    updatedAt: '2024-01-05T11:00:00Z',
  },
  {
    id: 5,
    roleTitle: 'Problem Solver',
    paragraphs: [
      'I thrive on solving complex technical challenges and finding elegant solutions to difficult problems.',
    ],
    stats: [
      { label: 'Algorithms', value: 'Advanced' },
      { label: 'Code Reviews', value: '200+' },
      { label: 'Bug Fixes', value: '500+' },
    ],
    orderIndex: 4,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T11:30:00Z',
  },
];

// Legacy support - return first section
export const mockAboutContent: AboutContent = mockAboutSections[0] || DEFAULT_ABOUT_SECTION;

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
    organization: 'Tech Corp Inc.',
    location: 'San Francisco, CA',
    employmentType: 'full_time',
    summary: 'Progressive career growth from intern to senior developer, leading multiple high-impact projects and mentoring team members.',
    overallPeriod: 'Jan 2020 – Present',
    roles: [
      {
        id: 'role-1-1',
        jobTitle: 'Intern',
        startDate: '2020-01',
        endDate: '2020-06',
        isCurrent: false,
        description: 'Started as an intern, learning the codebase and contributing to small features. Worked closely with senior developers to understand best practices.',
        orderIndex: 0,
      },
      {
        id: 'role-1-2',
        jobTitle: 'Junior Full Stack Developer',
        startDate: '2020-07',
        endDate: '2021-12',
        isCurrent: false,
        description: 'Promoted to junior developer. Built and maintained web applications using React and Node.js. Collaborated with cross-functional teams on multiple projects.',
        orderIndex: 1,
      },
      {
        id: 'role-1-3',
        jobTitle: 'Full Stack Developer',
        startDate: '2022-01',
        endDate: '2023-06',
        isCurrent: false,
        description: 'Took on more responsibilities, leading development of new features and mentoring junior developers. Improved application performance and user experience.',
        orderIndex: 2,
      },
      {
        id: 'role-1-4',
        jobTitle: 'Senior Full Stack Developer',
        startDate: '2023-07',
        endDate: null,
        isCurrent: true,
        description: 'Leading development of multiple web applications using React, Node.js, and cloud technologies. Architecting scalable solutions and driving technical decisions.',
        orderIndex: 3,
      },
    ],
    orderIndex: 0,
  },
  {
    id: 2,
    organization: 'Digital Solutions Ltd.',
    location: 'New York, NY',
    employmentType: 'full_time',
    overallPeriod: 'Mar 2018 – Dec 2019',
    roles: [
      {
        id: 'role-2-1',
        jobTitle: 'Frontend Developer',
        startDate: '2018-03',
        endDate: '2019-06',
        isCurrent: false,
        description: 'Developed responsive web interfaces using React and modern CSS. Focused on creating user-friendly and accessible designs.',
        orderIndex: 0,
      },
      {
        id: 'role-2-2',
        jobTitle: 'Full Stack Developer',
        startDate: '2019-07',
        endDate: '2019-12',
        isCurrent: false,
        description: 'Expanded to full-stack development, working on both frontend and backend. Developed and maintained web applications, collaborated with cross-functional teams.',
        orderIndex: 1,
      },
    ],
    orderIndex: 1,
  },
  {
    id: 3,
    organization: 'StartupXYZ',
    location: 'Remote',
    employmentType: 'contract',
    overallPeriod: 'Jun 2016 – Feb 2018',
    roles: [
      {
        id: 'role-3-1',
        jobTitle: 'Junior Developer',
        startDate: '2016-06',
        endDate: '2018-02',
        isCurrent: false,
        description: 'Started my career working on frontend development and learning backend technologies. Built my first production applications and learned agile methodologies.',
        orderIndex: 0,
      },
    ],
    orderIndex: 2,
  },
];

export const mockSkills: Skill[] = [
  // Frontend Skills
  { id: 1, name: 'JavaScript', level: 95, category: 'frontend', orderIndex: 0 },
  { id: 2, name: 'TypeScript', level: 90, category: 'frontend', orderIndex: 1 },
  { id: 3, name: 'React', level: 92, category: 'frontend', orderIndex: 2 },
  { id: 4, name: 'Next.js', level: 88, category: 'frontend', orderIndex: 3 },
  { id: 5, name: 'CSS/Tailwind', level: 90, category: 'frontend', orderIndex: 4 },
  // Backend Skills
  { id: 6, name: 'Node.js', level: 88, category: 'backend', orderIndex: 0 },
  { id: 7, name: 'Python', level: 85, category: 'backend', orderIndex: 1 },
  { id: 8, name: 'Express.js', level: 82, category: 'backend', orderIndex: 2 },
  { id: 9, name: 'GraphQL', level: 78, category: 'backend', orderIndex: 3 },
  // Database Skills
  { id: 10, name: 'PostgreSQL', level: 85, category: 'database', orderIndex: 0 },
  { id: 11, name: 'MongoDB', level: 80, category: 'database', orderIndex: 1 },
  { id: 12, name: 'Redis', level: 75, category: 'database', orderIndex: 2 },
  // DevOps Skills
  { id: 13, name: 'Docker', level: 80, category: 'devops', orderIndex: 0 },
  { id: 14, name: 'AWS', level: 75, category: 'devops', orderIndex: 1 },
  { id: 15, name: 'CI/CD', level: 78, category: 'devops', orderIndex: 2 },
  // Tools
  { id: 16, name: 'Git', level: 92, category: 'tools', orderIndex: 0 },
  { id: 17, name: 'VS Code', level: 95, category: 'tools', orderIndex: 1 },
  { id: 18, name: 'Figma', level: 70, category: 'tools', orderIndex: 2 },
  // Soft Skills
  { id: 19, name: 'Communication', level: 88, category: 'soft', orderIndex: 0 },
  { id: 20, name: 'Problem Solving', level: 90, category: 'soft', orderIndex: 1 },
  { id: 21, name: 'Team Collaboration', level: 85, category: 'soft', orderIndex: 2 },
];

export const mockProjects: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    shortDescription: 'Full-stack online shopping platform with payment integration',
    description: 'A comprehensive e-commerce platform built with React and Node.js featuring user authentication, product management, shopping cart, payment integration with Stripe, order tracking, and a complete admin dashboard for managing inventory and orders.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Express', 'Redux'],
    thumbnail: '/images/project1.jpg',
    liveUrl: 'https://ecommerce-demo.example.com',
    githubUrl: 'https://github.com/example/ecommerce',
    category: 'Web Application',
    status: 'live',
    featured: true,
    startDate: '2023-01-15',
    endDate: '2023-04-20',
    orderIndex: 0,
    isPublished: true,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-04-20T15:30:00Z',
  },
  {
    id: 2,
    title: 'Task Management App',
    shortDescription: 'Collaborative task management with real-time updates',
    description: 'A modern task management application built with Next.js featuring real-time collaboration, team workspaces, drag-and-drop task boards, priority management, file attachments, and integration with popular productivity tools.',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'WebSockets', 'Prisma', 'TailwindCSS'],
    thumbnail: '/images/project2.jpg',
    liveUrl: 'https://tasks.example.com',
    githubUrl: 'https://github.com/example/tasks',
    category: 'Web Application',
    status: 'live',
    featured: true,
    startDate: '2023-05-01',
    endDate: '2023-07-15',
    orderIndex: 1,
    isPublished: true,
    createdAt: '2023-05-01T09:00:00Z',
    updatedAt: '2023-07-15T14:20:00Z',
  },
  {
    id: 3,
    title: 'AI Image Classifier',
    shortDescription: 'Machine learning model for image classification',
    description: 'Deep learning image classification system using convolutional neural networks. Trained on custom datasets with transfer learning techniques. Features REST API for integration and web interface for testing.',
    techStack: ['Python', 'TensorFlow', 'Keras', 'Flask', 'Docker'],
    thumbnail: '/images/project3.jpg',
    githubUrl: 'https://github.com/example/ai-classifier',
    category: 'Machine Learning',
    status: 'archived',
    featured: false,
    startDate: '2022-09-01',
    endDate: '2022-11-30',
    orderIndex: 2,
    isPublished: false,
    createdAt: '2022-09-01T08:00:00Z',
    updatedAt: '2022-11-30T16:45:00Z',
  },
  {
    id: 4,
    title: 'Portfolio Admin Dashboard',
    shortDescription: 'Modern portfolio management system',
    description: 'A comprehensive admin dashboard for managing portfolio content including projects, skills, experience, and education. Features analytics, content management, and real-time preview capabilities.',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Recharts'],
    thumbnail: '/images/project4.jpg',
    liveUrl: 'https://admin.portfolio.example.com',
    githubUrl: 'https://github.com/example/portfolio-admin',
    category: 'Web Application',
    status: 'development',
    featured: true,
    startDate: '2024-01-01',
    endDate: null,
    orderIndex: 3,
    isPublished: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-07T12:00:00Z',
  },
  {
    id: 5,
    title: 'Weather Forecast API',
    shortDescription: 'RESTful API for weather data aggregation',
    description: 'Microservice architecture for aggregating weather data from multiple sources. Provides unified API with caching, rate limiting, and historical data analysis.',
    techStack: ['Node.js', 'Express', 'Redis', 'PostgreSQL', 'Docker', 'Kubernetes'],
    thumbnail: '/images/project5.jpg',
    liveUrl: 'https://api.weather.example.com',
    githubUrl: 'https://github.com/example/weather-api',
    category: 'API Service',
    status: 'live',
    featured: false,
    startDate: '2023-08-01',
    endDate: '2023-10-15',
    orderIndex: 4,
    isPublished: true,
    createdAt: '2023-08-01T11:00:00Z',
    updatedAt: '2023-10-15T13:30:00Z',
  },
  {
    id: 6,
    title: 'Mobile Fitness Tracker',
    shortDescription: 'Cross-platform fitness tracking mobile app',
    description: 'React Native application for tracking workouts, nutrition, and progress. Features include exercise library, custom workout plans, progress photos, and integration with wearable devices.',
    techStack: ['React Native', 'TypeScript', 'Firebase', 'Redux', 'Expo'],
    thumbnail: '/images/project6.jpg',
    liveUrl: 'https://fitness.example.com',
    githubUrl: 'https://github.com/example/fitness-tracker',
    category: 'Mobile Application',
    status: 'live',
    featured: false,
    startDate: '2023-02-01',
    endDate: '2023-06-30',
    orderIndex: 5,
    isPublished: true,
    createdAt: '2023-02-01T09:30:00Z',
    updatedAt: '2023-06-30T17:00:00Z',
  },
  {
    id: 7,
    title: 'Social Media Analytics Dashboard',
    shortDescription: 'Analytics platform for social media insights',
    description: 'Real-time analytics dashboard for tracking social media performance across multiple platforms. Features sentiment analysis, engagement metrics, competitor analysis, and automated reporting.',
    techStack: ['Vue.js', 'Nuxt', 'Chart.js', 'Node.js', 'MongoDB', 'Redis'],
    thumbnail: '/images/project7.jpg',
    category: 'Web Application',
    status: 'draft',
    featured: false,
    startDate: '2024-01-05',
    endDate: null,
    orderIndex: 6,
    isPublished: false,
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-07T11:00:00Z',
  },
  {
    id: 8,
    title: 'Blockchain Wallet',
    shortDescription: 'Secure cryptocurrency wallet application',
    description: 'Multi-currency cryptocurrency wallet with hardware wallet integration, transaction history, portfolio tracking, and exchange integration. Built with security best practices.',
    techStack: ['React', 'Electron', 'Web3.js', 'TypeScript', 'Rust'],
    thumbnail: '/images/project8.jpg',
    githubUrl: 'https://github.com/example/blockchain-wallet',
    category: 'Desktop Application',
    status: 'development',
    featured: false,
    startDate: '2023-11-01',
    endDate: null,
    orderIndex: 7,
    isPublished: true,
    createdAt: '2023-11-01T08:00:00Z',
    updatedAt: '2024-01-07T10:30:00Z',
  },
  {
    id: 9,
    title: 'Video Streaming Platform',
    shortDescription: 'Netflix-like video streaming service',
    description: 'Complete video streaming platform with adaptive bitrate streaming, user profiles, recommendation engine, content management system, and payment integration.',
    techStack: ['Next.js', 'AWS', 'DynamoDB', 'Lambda', 'S3', 'CloudFront'],
    thumbnail: '/images/project9.jpg',
    liveUrl: 'https://stream.example.com',
    githubUrl: 'https://github.com/example/video-platform',
    category: 'Web Application',
    status: 'live',
    featured: true,
    startDate: '2022-06-01',
    endDate: '2023-01-31',
    orderIndex: 8,
    isPublished: true,
    createdAt: '2022-06-01T10:00:00Z',
    updatedAt: '2023-01-31T16:00:00Z',
  },
  {
    id: 10,
    title: 'Restaurant Booking System',
    shortDescription: 'Online table reservation and management',
    description: 'Restaurant management system with online booking, table management, waitlist handling, customer reviews, and POS integration. Includes mobile app for customers.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Stripe'],
    thumbnail: '/images/project10.jpg',
    liveUrl: 'https://bookings.example.com',
    githubUrl: 'https://github.com/example/restaurant-booking',
    category: 'Web Application',
    status: 'live',
    featured: false,
    startDate: '2023-03-15',
    endDate: '2023-08-20',
    orderIndex: 9,
    isPublished: true,
    createdAt: '2023-03-15T09:00:00Z',
    updatedAt: '2023-08-20T14:30:00Z',
  },
  {
    id: 11,
    title: 'Code Snippet Manager',
    shortDescription: 'Developer tool for organizing code snippets',
    description: 'Desktop application for saving, organizing, and searching code snippets. Features syntax highlighting, tagging, collections, cloud sync, and IDE integrations.',
    techStack: ['Electron', 'React', 'TypeScript', 'SQLite', 'Monaco Editor'],
    thumbnail: '/images/project11.jpg',
    githubUrl: 'https://github.com/example/snippet-manager',
    category: 'Desktop Application',
    status: 'development',
    featured: false,
    startDate: '2023-12-01',
    endDate: null,
    orderIndex: 10,
    isPublished: true,
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2024-01-07T09:00:00Z',
  },
  {
    id: 12,
    title: 'Real Estate Platform',
    shortDescription: 'Property listing and management system',
    description: 'Comprehensive real estate platform with property listings, virtual tours, mortgage calculator, agent management, and lead generation tools.',
    techStack: ['Next.js', 'PostgreSQL', 'Prisma', 'Mapbox', 'TailwindCSS'],
    thumbnail: '/images/project12.jpg',
    liveUrl: 'https://realestate.example.com',
    category: 'Web Application',
    status: 'draft',
    featured: false,
    startDate: '2024-01-03',
    endDate: null,
    orderIndex: 11,
    isPublished: false,
    createdAt: '2024-01-03T08:30:00Z',
    updatedAt: '2024-01-07T10:00:00Z',
  },
  {
    id: 13,
    title: 'DevOps Monitoring Tool',
    shortDescription: 'Infrastructure monitoring and alerting',
    description: 'Real-time monitoring solution for servers, containers, and applications. Features include custom dashboards, alerting rules, log aggregation, and performance metrics.',
    techStack: ['Go', 'React', 'Prometheus', 'Grafana', 'Docker', 'PostgreSQL'],
    thumbnail: '/images/project13.jpg',
    githubUrl: 'https://github.com/example/devops-monitor',
    category: 'DevOps Tool',
    status: 'live',
    featured: true,
    startDate: '2023-04-01',
    endDate: '2023-09-30',
    orderIndex: 12,
    isPublished: true,
    createdAt: '2023-04-01T10:00:00Z',
    updatedAt: '2023-09-30T15:00:00Z',
  },
  {
    id: 14,
    title: 'Language Learning App',
    shortDescription: 'Interactive language learning platform',
    description: 'Gamified language learning application with interactive lessons, pronunciation practice, vocabulary building, and progress tracking.',
    techStack: ['React Native', 'Firebase', 'TensorFlow.js', 'Redux', 'TypeScript'],
    thumbnail: '/images/project14.jpg',
    githubUrl: 'https://github.com/example/language-app',
    category: 'Mobile Application',
    status: 'archived',
    featured: false,
    startDate: '2022-03-01',
    endDate: '2022-08-15',
    orderIndex: 13,
    isPublished: false,
    createdAt: '2022-03-01T09:00:00Z',
    updatedAt: '2022-08-15T16:30:00Z',
  },
  {
    id: 15,
    title: 'Invoice Management System',
    shortDescription: 'Professional invoicing and billing solution',
    description: 'Complete invoicing system for freelancers and small businesses. Features include invoice generation, payment tracking, expense management, and financial reporting.',
    techStack: ['Vue.js', 'Laravel', 'MySQL', 'Stripe', 'PDF.js'],
    thumbnail: '/images/project15.jpg',
    liveUrl: 'https://invoice.example.com',
    githubUrl: 'https://github.com/example/invoice-system',
    category: 'Web Application',
    status: 'live',
    featured: false,
    startDate: '2023-07-01',
    endDate: '2023-11-15',
    orderIndex: 14,
    isPublished: true,
    createdAt: '2023-07-01T10:00:00Z',
    updatedAt: '2023-11-15T14:00:00Z',
  },
  {
    id: 16,
    title: 'IoT Home Automation',
    shortDescription: 'Smart home control and automation system',
    description: 'IoT platform for controlling smart home devices. Features include device management, automation rules, voice control integration, and energy monitoring.',
    techStack: ['Python', 'FastAPI', 'MQTT', 'React', 'WebSocket', 'Raspberry Pi'],
    thumbnail: '/images/project16.jpg',
    githubUrl: 'https://github.com/example/iot-automation',
    category: 'IoT Application',
    status: 'development',
    featured: false,
    startDate: '2023-10-01',
    endDate: null,
    orderIndex: 15,
    isPublished: true,
    createdAt: '2023-10-01T08:00:00Z',
    updatedAt: '2024-01-07T11:30:00Z',
  },
  {
    id: 17,
    title: 'Job Board Platform',
    shortDescription: 'Modern job listing and application platform',
    description: 'Job board with advanced search, company profiles, application tracking, resume builder, and AI-powered job matching.',
    techStack: ['Next.js', 'Node.js', 'PostgreSQL', 'Elasticsearch', 'Redis'],
    thumbnail: '/images/project17.jpg',
    liveUrl: 'https://jobs.example.com',
    githubUrl: 'https://github.com/example/job-board',
    category: 'Web Application',
    status: 'live',
    featured: false,
    startDate: '2022-11-01',
    endDate: '2023-03-30',
    orderIndex: 16,
    isPublished: true,
    createdAt: '2022-11-01T10:00:00Z',
    updatedAt: '2023-03-30T15:30:00Z',
  },
  {
    id: 18,
    title: 'Music Streaming API',
    shortDescription: 'Backend service for music streaming',
    description: 'Scalable API for music streaming service with playlist management, audio processing, recommendation engine, and analytics.',
    techStack: ['Node.js', 'Express', 'MongoDB', 'Redis', 'AWS S3', 'Docker'],
    thumbnail: '/images/project18.jpg',
    githubUrl: 'https://github.com/example/music-api',
    category: 'API Service',
    status: 'archived',
    featured: false,
    startDate: '2022-01-15',
    endDate: '2022-06-30',
    orderIndex: 17,
    isPublished: false,
    createdAt: '2022-01-15T09:00:00Z',
    updatedAt: '2022-06-30T17:00:00Z',
  },
  {
    id: 19,
    title: 'Customer Support Chat',
    shortDescription: 'Real-time customer support chat widget',
    description: 'Embeddable chat widget for websites with live chat, chatbot integration, ticket system, and analytics dashboard for support teams.',
    techStack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Redis'],
    thumbnail: '/images/project19.jpg',
    liveUrl: 'https://chat.example.com',
    githubUrl: 'https://github.com/example/support-chat',
    category: 'Web Widget',
    status: 'live',
    featured: false,
    startDate: '2023-09-01',
    endDate: '2023-12-20',
    orderIndex: 18,
    isPublished: true,
    createdAt: '2023-09-01T10:00:00Z',
    updatedAt: '2023-12-20T16:00:00Z',
  },
  {
    id: 20,
    title: 'Expense Tracker Mobile App',
    shortDescription: 'Personal finance management on mobile',
    description: 'Mobile app for tracking expenses, setting budgets, and analyzing spending patterns. Features include receipt scanning, category management, and financial reports.',
    techStack: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
    thumbnail: '/images/project20.jpg',
    githubUrl: 'https://github.com/example/expense-tracker',
    category: 'Mobile Application',
    status: 'development',
    featured: false,
    startDate: '2023-11-15',
    endDate: null,
    orderIndex: 19,
    isPublished: true,
    createdAt: '2023-11-15T09:00:00Z',
    updatedAt: '2024-01-07T10:00:00Z',
  },
  {
    id: 21,
    title: 'Email Marketing Platform',
    shortDescription: 'Campaign management and automation',
    description: 'Email marketing platform with drag-and-drop email builder, campaign automation, subscriber management, A/B testing, and detailed analytics.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'AWS SES'],
    thumbnail: '/images/project21.jpg',
    category: 'Web Application',
    status: 'draft',
    featured: false,
    startDate: '2024-01-02',
    endDate: null,
    orderIndex: 20,
    isPublished: false,
    createdAt: '2024-01-02T08:00:00Z',
    updatedAt: '2024-01-07T09:30:00Z',
  },
  {
    id: 22,
    title: 'Online Learning Platform',
    shortDescription: 'E-learning platform with video courses',
    description: 'Comprehensive learning management system with video courses, quizzes, certificates, progress tracking, and instructor dashboard.',
    techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'AWS', 'Stripe', 'Mux'],
    thumbnail: '/images/project22.jpg',
    liveUrl: 'https://learn.example.com',
    githubUrl: 'https://github.com/example/learning-platform',
    category: 'Web Application',
    status: 'live',
    featured: true,
    startDate: '2022-08-01',
    endDate: '2023-02-28',
    orderIndex: 21,
    isPublished: true,
    createdAt: '2022-08-01T10:00:00Z',
    updatedAt: '2023-02-28T15:00:00Z',
  },
  {
    id: 23,
    title: 'Document Collaboration Tool',
    shortDescription: 'Real-time collaborative document editing',
    description: 'Google Docs-like collaborative editing tool with real-time synchronization, commenting, version history, and sharing controls.',
    techStack: ['React', 'TypeScript', 'WebSocket', 'Yjs', 'Node.js', 'MongoDB'],
    thumbnail: '/images/project23.jpg',
    githubUrl: 'https://github.com/example/doc-collab',
    category: 'Web Application',
    status: 'development',
    featured: false,
    startDate: '2023-12-15',
    endDate: null,
    orderIndex: 22,
    isPublished: true,
    createdAt: '2023-12-15T09:00:00Z',
    updatedAt: '2024-01-07T11:00:00Z',
  },
  {
    id: 24,
    title: 'API Testing Suite',
    shortDescription: 'Postman alternative for API testing',
    description: 'Desktop application for testing REST and GraphQL APIs. Features include request collections, environment variables, automated testing, and team collaboration.',
    techStack: ['Electron', 'Vue.js', 'TypeScript', 'IndexedDB'],
    thumbnail: '/images/project24.jpg',
    githubUrl: 'https://github.com/example/api-tester',
    category: 'Desktop Application',
    status: 'live',
    featured: false,
    startDate: '2023-05-15',
    endDate: '2023-10-30',
    orderIndex: 23,
    isPublished: true,
    createdAt: '2023-05-15T10:00:00Z',
    updatedAt: '2023-10-30T16:30:00Z',
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

export const fetchPersonalProfiles = async (): Promise<PersonalProfile[]> => {
  await delay(500);
  return mockPersonalProfiles;
};

export const fetchAboutContent = async (): Promise<AboutContent> => {
  await delay(500);
  return mockAboutContent;
};

export const fetchAboutSections = async (): Promise<AboutSection[]> => {
  await delay(500);
  return mockAboutSections.length > 0 ? mockAboutSections : [DEFAULT_ABOUT_SECTION];
};

export const fetchEducation = async (): Promise<EducationEntry[]> => {
  await delay(500);
  return mockEducation.length > 0 ? mockEducation : [DEFAULT_EDUCATION];
};

export const fetchExperience = async (): Promise<ExperienceEntry[]> => {
  await delay(500);
  return mockExperience.length > 0 ? mockExperience : [DEFAULT_EXPERIENCE];
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

// Mock Activities for Dashboard
export const mockActivities = [
  {
    id: '1',
    type: 'update' as const,
    entity: 'project' as const,
    entityId: '1',
    entityName: 'E-Commerce Platform',
    description: 'Updated project "E-Commerce Platform"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '2',
    type: 'create' as const,
    entity: 'skill' as const,
    entityId: '21',
    entityName: 'Team Collaboration',
    description: 'Added skill "Team Collaboration"',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: '3',
    type: 'update' as const,
    entity: 'education' as const,
    entityId: '1',
    entityName: 'Bachelor of Science',
    description: 'Updated education entry',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: '4',
    type: 'create' as const,
    entity: 'experience' as const,
    entityId: '1',
    entityName: 'Senior Full Stack Developer',
    description: 'Added work experience "Senior Full Stack Developer"',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: '5',
    type: 'update' as const,
    entity: 'project' as const,
    entityId: '2',
    entityName: 'Task Management App',
    description: 'Published project "Task Management App"',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: '6',
    type: 'create' as const,
    entity: 'skill' as const,
    entityId: '20',
    entityName: 'Problem Solving',
    description: 'Added skill "Problem Solving"',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: '7',
    type: 'delete' as const,
    entity: 'project' as const,
    entityId: '99',
    entityName: 'Old Portfolio',
    description: 'Deleted project "Old Portfolio"',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: '8',
    type: 'update' as const,
    entity: 'experience' as const,
    entityId: '2',
    entityName: 'Full Stack Developer',
    description: 'Updated experience "Full Stack Developer"',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: '9',
    type: 'create' as const,
    entity: 'project' as const,
    entityId: '3',
    entityName: 'AI Image Classifier',
    description: 'Created project "AI Image Classifier"',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: '10',
    type: 'update' as const,
    entity: 'skill' as const,
    entityId: '1',
    entityName: 'JavaScript',
    description: 'Updated skill level for JavaScript',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
];

// Mock Sparkline Data
export const mockSparklineData = {
  projects: [18, 19, 20, 21, 22, 23, 24],
  skills: [25, 27, 29, 28, 30, 31, 32],
  education: [3, 3, 4, 4, 4, 4, 4],
  experience: [3, 4, 4, 5, 5, 5, 5],
};

export const fetchActivities = async () => {
  await delay(500);
  return mockActivities;
};

// Website Analytics Mock Data
// Generate last 30 days of traffic data
const generateVisitTrend = () => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Simulate realistic traffic patterns (higher on weekdays)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const baseVisits = isWeekend ? 80 : 150;
    const randomVariation = Math.floor(Math.random() * 50);
    const visits = baseVisits + randomVariation;

    data.push({
      date: date.toISOString().split('T')[0],
      visits: visits,
      uniqueVisitors: Math.floor(visits * 0.75),
      pageViews: Math.floor(visits * 2.5),
    });
  }

  return data;
};

export const mockWebsiteAnalytics = {
  totalVisits: 3847,
  uniqueVisitors: 2891,
  pageViews: 9618,
  cvDownloads: 247,
  averageSessionDuration: 185, // 3 minutes 5 seconds
  bounceRate: 42.5,
  visitTrend: generateVisitTrend(),
  topPages: [
    { page: '/projects', views: 2847, averageTime: 245 },
    { page: '/', views: 2134, averageTime: 156 },
    { page: '/about', views: 1523, averageTime: 189 },
    { page: '/contact', views: 892, averageTime: 98 },
    { page: '/skills', views: 734, averageTime: 167 },
  ],
  deviceBreakdown: [
    { device: 'desktop' as const, count: 2156, percentage: 56 },
    { device: 'mobile' as const, count: 1347, percentage: 35 },
    { device: 'tablet' as const, count: 344, percentage: 9 },
  ],
  trafficSources: [
    { source: 'Direct', visits: 1539, percentage: 40 },
    { source: 'Google', visits: 1154, percentage: 30 },
    { source: 'GitHub', visits: 769, percentage: 20 },
    { source: 'LinkedIn', visits: 231, percentage: 6 },
    { source: 'Twitter', visits: 154, percentage: 4 },
  ],
};

export const fetchWebsiteAnalytics = async () => {
  await delay(500);
  return mockWebsiteAnalytics;
};

