jest.mock('../api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
  toAssetUrl: (p: string | null) => (p ? `http://localhost:5000${p}` : ''),
  toRelativeAssetPath: (u: string | null) =>
    u && u.startsWith('http://localhost:5000')
      ? u.slice('http://localhost:5000'.length)
      : u || null,
}));
jest.mock('../categories.api', () => ({
  categoriesApi: { resolveIdByName: jest.fn().mockResolvedValue('cat-resolved-id') },
}));
jest.mock('../skills.api', () => ({
  skillsApi: { resolveIdsByNames: jest.fn().mockResolvedValue(['skill-1', 'skill-2']) },
}));

import api from '../api';
import { projectsApi } from '../projects.api';
import { categoriesApi } from '../categories.api';
import { skillsApi } from '../skills.api';

const mockedApi = api as jest.Mocked<typeof api>;

describe('projectsApi', () => {
  beforeEach(() => jest.clearAllMocks());

  const backendProject = {
    id: 'proj-1',
    title: 'My Project',
    short_description: 'Short',
    description: 'Long description',
    thumbnail_url: '/uploads/images/thumb.png',
    status: 'LIVE',
    start_date: '2024-01-01T00:00:00.000Z',
    end_date: null,
    demo_url: 'https://demo.example.com',
    repo_url: 'https://github.com/example/repo',
    featured: true,
    is_published: true,
    order_index: 0,
    category_id: 'cat-1',
    category: { id: 'cat-1', name: 'Web Application', slug: 'web-application' },
    project_skills: [
      { skill: { id: 's-1', name: 'React' } },
      { skill: { id: 's-2', name: 'Node.js' } },
    ],
    decisions: [{ question: 'Why Prisma?', answer: 'Type-safe queries and migration history.' }],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
  };

  describe('getAll', () => {
    it('maps backend snake_case DTOs to the admin Project shape', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendProject] } });

      const result = await projectsApi.getAll();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'proj-1',
        title: 'My Project',
        shortDescription: 'Short',
        description: 'Long description',
        techStack: ['React', 'Node.js'],
        thumbnail: 'http://localhost:5000/uploads/images/thumb.png',
        liveUrl: 'https://demo.example.com',
        githubUrl: 'https://github.com/example/repo',
        category: 'Web Application',
        status: 'live',
        featured: true,
        endDate: null,
        orderIndex: 0,
        isPublished: true,
        decisions: [
          { question: 'Why Prisma?', answer: 'Type-safe queries and migration history.' },
        ],
      });
    });

    it('defaults decisions to an empty array when the backend field is absent', async () => {
      mockedApi.get.mockResolvedValue({
        data: { data: [{ ...backendProject, decisions: undefined }] },
      });
      const result = await projectsApi.getAll();
      expect(result[0]!.decisions).toEqual([]);
    });

    it('maps every backend status enum value to its admin lowercase equivalent', async () => {
      const statuses: Array<[string, string]> = [
        ['LIVE', 'live'],
        ['DRAFT', 'draft'],
        ['DEVELOPMENT', 'development'],
        ['ARCHIVED', 'archived'],
      ];

      for (const [backendStatus, adminStatus] of statuses) {
        mockedApi.get.mockResolvedValue({
          data: { data: [{ ...backendProject, status: backendStatus }] },
        });
        const result = await projectsApi.getAll();
        expect(result[0]!.status).toBe(adminStatus);
      }
    });

    it('defaults techStack to an empty array when project_skills is absent', async () => {
      mockedApi.get.mockResolvedValue({
        data: { data: [{ ...backendProject, project_skills: undefined }] },
      });
      const result = await projectsApi.getAll();
      expect(result[0]!.techStack).toEqual([]);
    });
  });

  describe('create/update payload mapping', () => {
    it('resolves category name and tech stack names to ids before posting', async () => {
      mockedApi.post.mockResolvedValue({ data: { data: backendProject } });

      await projectsApi.create({
        title: 'New',
        shortDescription: 'Short',
        description: 'Long',
        category: 'Web Application',
        techStack: ['React', 'Node.js'],
        thumbnail: 'https://example.com/thumb.png',
        status: 'live',
        featured: false,
        isPublished: true,
        startDate: '2024-01-01',
        endDate: null,
        decisions: [],
      });

      expect(categoriesApi.resolveIdByName).toHaveBeenCalledWith('Web Application');
      expect(skillsApi.resolveIdsByNames).toHaveBeenCalledWith(['React', 'Node.js']);
      expect(mockedApi.post).toHaveBeenCalledWith(
        '/projects',
        expect.objectContaining({
          title: 'New',
          short_description: 'Short',
          status: 'LIVE',
          category_id: 'cat-resolved-id',
          skill_ids: ['skill-1', 'skill-2'],
          demo_url: null,
          repo_url: null,
        })
      );
    });

    it('includes decisions in the create/update payload', async () => {
      mockedApi.post.mockResolvedValue({ data: { data: backendProject } });

      const decisions = [
        { question: 'Why Prisma?', answer: 'Type-safe queries and migration history.' },
      ];

      await projectsApi.create({
        title: 'New',
        shortDescription: 'Short',
        description: 'Long',
        category: 'Web Application',
        techStack: ['React'],
        thumbnail: 'https://example.com/thumb.png',
        status: 'live',
        featured: false,
        isPublished: true,
        startDate: '2024-01-01',
        endDate: null,
        decisions,
      });

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/projects',
        expect.objectContaining({ decisions })
      );
    });

    it('strips a resolved thumbnail URL back to a relative path before persisting', async () => {
      mockedApi.patch.mockResolvedValue({ data: { data: backendProject } });

      await projectsApi.update('proj-1', {
        thumbnail: 'http://localhost:5000/uploads/images/thumb.png',
      });

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/projects/proj-1',
        expect.objectContaining({ thumbnail_url: '/uploads/images/thumb.png' })
      );
    });
  });

  describe('delete/restore', () => {
    it('calls DELETE with the project id', async () => {
      mockedApi.delete.mockResolvedValue({ data: {} });
      await projectsApi.delete('proj-1');
      expect(mockedApi.delete).toHaveBeenCalledWith('/projects/proj-1');
    });

    it('calls the restore endpoint and maps the response', async () => {
      mockedApi.patch.mockResolvedValue({ data: { data: backendProject } });
      const result = await projectsApi.restore('proj-1');
      expect(mockedApi.patch).toHaveBeenCalledWith('/projects/proj-1/restore');
      expect(result.id).toBe('proj-1');
    });
  });
});
