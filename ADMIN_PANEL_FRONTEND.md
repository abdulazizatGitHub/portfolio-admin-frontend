# Admin Panel Frontend - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Authentication](#authentication)
5. [Pages & Routes](#pages--routes)
6. [Components Architecture](#components-architecture)
7. [Data Management](#data-management)
8. [TypeScript Types](#typescript-types)
9. [API Integration](#api-integration)
10. [Styling with Tailwind](#styling-with-tailwind)
11. [Docker Setup](#docker-setup)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Environment Variables](#environment-variables)
14. [Deployment](#deployment)

---

## 🎯 Overview

### Purpose

The Admin Panel Frontend is a Next.js application that provides a secure, user-friendly interface for managing all portfolio content dynamically. This allows you to update your portfolio without touching code.

### Key Features

- ✅ **Secure Authentication** - Admin-only access with JWT-based authentication
- ✅ **Content Management** - CRUD operations for all portfolio sections
- ✅ **Real-time Updates** - Changes reflect immediately on portfolio
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Type Safety** - Full TypeScript implementation
- ✅ **Modern UI** - Built with Tailwind CSS

### Target Users

- **Primary**: Portfolio owner (you) - Admin access only
- **Future**: Multiple admins (if needed)

---

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **State Management**: TanStack Query (React Query) v5
- **HTTP Client**: Axios or native fetch with typed wrappers
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js v5 or custom JWT implementation
- **UI Components**: Headless UI or shadcn/ui (optional)

### Development Tools

- **Package Manager**: npm or pnpm
- **Linting**: ESLint + TypeScript ESLint
- **Formatting**: Prettier
- **Testing**: Jest + React Testing Library (optional)
- **Type Checking**: TypeScript strict mode

---

## 📁 Project Structure

```
admin-panel-frontend/
├── .next/                    # Next.js build output (gitignored)
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # CI/CD pipeline
├── public/                   # Static assets
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx    # Admin layout with sidebar
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── personal/
│   │   │   │   └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── education/
│   │   │   │   └── page.tsx
│   │   │   ├── experience/
│   │   │   │   └── page.tsx
│   │   │   ├── skills/
│   │   │   │   └── page.tsx
│   │   │   ├── projects/
│   │   │   │   └── page.tsx
│   │   │   └── contact/
│   │   │       └── page.tsx
│   │   ├── api/              # API routes (if needed)
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Card.tsx
│   │   │   └── TagInput.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── AuthLayout.tsx
│   │   └── forms/            # Form components
│   │       ├── PersonalForm.tsx
│   │       ├── AboutForm.tsx
│   │       ├── EducationForm.tsx
│   │       ├── ExperienceForm.tsx
│   │       ├── SkillsForm.tsx
│   │       ├── ProjectsForm.tsx
│   │       └── ContactForm.tsx
│   ├── lib/
│   │   ├── api/              # API client
│   │   │   ├── client.ts      # Axios instance
│   │   │   ├── endpoints.ts  # API endpoints
│   │   │   └── types.ts      # API request/response types
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePersonalContent.ts
│   │   │   ├── useAboutContent.ts
│   │   │   ├── useEducation.ts
│   │   │   ├── useExperience.ts
│   │   │   ├── useSkills.ts
│   │   │   ├── useProjects.ts
│   │   │   └── useContact.ts
│   │   ├── utils/            # Utility functions
│   │   │   ├── validation.ts
│   │   │   └── helpers.ts
│   │   └── auth/             # Authentication utilities
│   │       └── config.ts
│   ├── types/                # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── personal.ts
│   │   ├── about.ts
│   │   ├── education.ts
│   │   ├── experience.ts
│   │   ├── skills.ts
│   │   ├── projects.ts
│   │   ├── contact.ts
│   │   └── auth.ts
│   └── middleware.ts         # Next.js middleware for auth
├── .env.local                # Local environment variables
├── .env.example             # Example environment variables
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## 🔐 Authentication

### Authentication Strategy

**Option 1: NextAuth.js (Recommended)**

```typescript
// src/lib/auth/config.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Call backend API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (res.ok) {
          const user = await res.json();
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
};

export default NextAuth(authOptions);
```

**Option 2: Custom JWT Implementation**

```typescript
// src/lib/auth/jwt.ts
export const setAuthToken = (token: string) => {
  // Store in HTTP-only cookie via API route
  fetch('/api/auth/set-token', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

export const getAuthToken = async () => {
  const res = await fetch('/api/auth/get-token');
  return res.json();
};
```

### Protected Routes Middleware

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

### Auth Hook

```typescript
// src/lib/hooks/useAuth.ts
import { useSession, signIn, signOut } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login: signIn,
    logout: signOut,
  };
};
```

---

## 📄 Pages & Routes

### 1. Login Page (`/admin/login`)

**File**: `src/app/(auth)/login/page.tsx`

**Features**:
- Email and password input fields
- Form validation
- Error handling
- Loading states
- Redirect to dashboard on success

**Example Structure**:
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </AuthLayout>
  );
}
```

### 2. Dashboard (`/admin`)

**File**: `src/app/(admin)/page.tsx`

**Features**:
- Overview cards (stats)
- Quick navigation to sections
- Recent activity (optional)
- Last updated timestamps

**Data to Display**:
- Total Projects
- Total Skills
- Education Entries Count
- Experience Entries Count
- Last Content Update Date

### 3. Personal Content (`/admin/personal`)

**File**: `src/app/(admin)/personal/page.tsx`

**Manages**:
- Name
- Title prefix ("Hi, I'm")
- Hero description
- Roles array (add, edit, delete, reorder)
- CV file path/name

**Form Fields**:
```typescript
interface PersonalFormData {
  name: string;
  titlePrefix: string;
  description: string;
  roles: string[];
  cvFilePath: string;
  cvDownloadName: string;
}
```

### 4. About Content (`/admin/about`)

**File**: `src/app/(admin)/about/page.tsx`

**Manages**:
- Role title
- About paragraphs (array, reorderable)
- Stats (CGPA, Projects, Experience)

**Features**:
- Add/remove paragraphs
- Drag-and-drop reordering
- Edit stats values

### 5. Education (`/admin/education`)

**File**: `src/app/(admin)/education/page.tsx`

**Manages**:
- Education entries (period, title, description)
- CRUD operations
- Drag-and-drop ordering

**Entry Structure**:
```typescript
interface EducationEntry {
  id?: number;
  period: string;
  title: string;
  description: string;
  orderIndex: number;
}
```

### 6. Experience (`/admin/experience`)

**File**: `src/app/(admin)/experience/page.tsx`

**Same structure as Education** but for work experience entries.

### 7. Skills (`/admin/skills`)

**File**: `src/app/(admin)/skills/page.tsx`

**Manages**:
- Technical Skills (category: 'technical')
- AI/ML Skills (category: 'ai')
- Each skill: name, percentage (0-100)

**Features**:
- Two-column layout or tabs
- Add/edit/delete skills
- Percentage slider or input

### 8. Projects (`/admin/projects`)

**File**: `src/app/(admin)/projects/page.tsx`

**Manages**:
- Project title
- Description
- Technologies (array of strings)
- Image path
- Live URL
- Source URL (GitHub)
- Order index
- Published status

**Features**:
- Table view with actions
- Modal for add/edit
- Tag input for technologies
- Image upload (future enhancement)

### 9. Contact (`/admin/contact`)

**File**: `src/app/(admin)/contact/page.tsx`

**Manages**:
- Contact info items (email, phone, location)
- Social links (LinkedIn, GitHub, etc.)
- Contact form messages

---

## 🧩 Components Architecture

### Layout Components

#### AdminLayout

```typescript
// src/components/layout/AdminLayout.tsx
'use client';

import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Sidebar

Navigation menu with links to all admin sections.

#### Topbar

User info, logout button, notifications (optional).

### UI Components

All UI components should be:
- Fully typed with TypeScript
- Accessible (ARIA labels, keyboard navigation)
- Styled with Tailwind CSS
- Reusable and composable

**Example Button Component**:
```typescript
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, children, ...props }: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
```

---

## 📊 Data Management

### React Query Setup

```typescript
// src/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Custom Hooks Example

```typescript
// src/lib/hooks/usePersonalContent.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { PersonalContent } from '@/types/personal';

export function usePersonalContent() {
  return useQuery<PersonalContent>({
    queryKey: ['personal'],
    queryFn: () => apiClient.get('/api/admin/personal').then(res => res.data),
  });
}

export function useUpdatePersonalContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PersonalContent) =>
      apiClient.put('/api/admin/personal', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal'] });
    },
  });
}
```

---

## 📝 TypeScript Types

### Type Definitions

```typescript
// src/types/personal.ts
export interface PersonalContent {
  name: string;
  titlePrefix: string;
  description: string;
  roles: string[];
  cvFilePath: string;
  cvDownloadName: string;
}

// src/types/about.ts
export interface AboutContent {
  roleTitle: string;
  paragraphs: string[];
  stats: {
    label: string;
    value: string;
  }[];
}

// src/types/education.ts
export interface EducationEntry {
  id?: number;
  period: string;
  title: string;
  description: string;
  orderIndex: number;
}

// src/types/skills.ts
export interface Skill {
  id?: number;
  name: string;
  level: number; // 0-100
  category: 'technical' | 'ai';
  orderIndex: number;
}

// src/types/projects.ts
export interface Project {
  id?: number;
  title: string;
  description: string;
  tech: string[];
  imagePath: string;
  liveUrl?: string;
  sourceUrl?: string;
  orderIndex: number;
  isPublished: boolean;
}

// src/types/contact.ts
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
```

---

## 🔌 API Integration

### API Client Setup

```typescript
// src/lib/api/client.ts
import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export { apiClient };
```

### API Endpoints

```typescript
// src/lib/api/endpoints.ts
export const API_ENDPOINTS = {
  // Auth
  login: '/api/auth/login',
  me: '/api/auth/me',
  
  // Content
  personal: '/api/admin/personal',
  roles: '/api/admin/roles',
  about: '/api/admin/about',
  aboutParagraphs: '/api/admin/about/paragraphs',
  education: '/api/admin/education',
  experience: '/api/admin/experience',
  skills: '/api/admin/skills',
  projects: '/api/admin/projects',
  contact: '/api/admin/contact',
  socialLinks: '/api/admin/social-links',
};
```

---

## 🎨 Styling with Tailwind

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
};
```

### Design System

Create a consistent design system with:
- Color palette
- Typography scale
- Spacing system
- Component variants
- Dark mode (optional)

---

## 🐳 Docker Setup

### Dockerfile

```dockerfile
# Multi-stage build for Admin Panel Frontend
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  admin-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: admin-panel-frontend
    ports:
      - "3001:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=http://localhost:5000
    restart: unless-stopped
```

### Next.js Config for Docker

```javascript
// next.config.js
module.exports = {
  output: 'standalone', // For Docker deployment
};
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: Admin Panel Frontend CI/CD

on:
  push:
    branches: [ main, admin-frontend ]
  pull_request:
    branches: [ main ]

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests (if available)
        run: npm run test -- --ci

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: lint-and-test
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js app
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

  docker-build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/admin-frontend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

---

## 🔧 Environment Variables

### .env.example

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-secret-key-here

# Node Environment
NODE_ENV=development
```

### Required Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXTAUTH_URL` - Frontend URL (for NextAuth)
- `NEXTAUTH_SECRET` - Secret for JWT signing

---

## 🚀 Deployment

### Deployment Options

1. **Vercel** (Recommended for Next.js)
   - Automatic deployments
   - Built-in CI/CD
   - Environment variables management

2. **Docker Container**
   - Deploy to any container platform
   - AWS ECS, Google Cloud Run, Azure Container Instances
   - Self-hosted VPS

3. **Traditional Hosting**
   - Node.js hosting (Render, Railway, Heroku)
   - Requires Node.js runtime

### Vercel Deployment Steps

1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `npm run build`
4. Set output directory: `.next`
5. Deploy automatically on push to main

### Docker Deployment Steps

1. Build image: `docker build -t admin-frontend .`
2. Run container: `docker run -p 3001:3000 admin-frontend`
3. Or use docker-compose: `docker-compose up -d`

---

## 📚 Additional Resources

### Recommended Packages

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "next-auth": "^5.0.0",
    "axios": "^1.6.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Next Steps

1. Initialize Next.js project with TypeScript
2. Install and configure Tailwind CSS
3. Set up authentication
4. Create API client and hooks
5. Build first page (Dashboard)
6. Implement CRUD for each section
7. Add Docker configuration
8. Set up CI/CD pipeline

---

**Last Updated**: 2024  
**Status**: Planning Phase  
**Version**: 1.0.0

