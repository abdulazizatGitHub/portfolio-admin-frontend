jest.mock('../api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

import api from '../api';
import { skillsApi } from '../skills.api';

const mockedApi = api as jest.Mocked<typeof api>;

describe('skillsApi', () => {
  beforeEach(() => jest.clearAllMocks());

  const backendSkill = (overrides = {}) => ({
    id: 's-1',
    name: 'React',
    slug: 'react',
    icon_url: null,
    category: 'Frontend',
    level: 80,
    context: 'Used across all projects',
    related_tools: ['Redux'],
    order_index: 0,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    ...overrides,
  });

  describe('getAll', () => {
    it('maps backend fields to the admin Skill shape, lowercasing category', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendSkill()] } });

      const result = await skillsApi.getAll();

      expect(result[0]).toMatchObject({
        id: 's-1',
        name: 'React',
        level: 80,
        category: 'frontend',
        orderIndex: 0,
        context: 'Used across all projects',
        relatedTools: ['Redux'],
      });
    });

    it("falls back to 'technical' when a skill has no category", async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendSkill({ category: null })] } });
      const result = await skillsApi.getAll();
      expect(result[0]!.category).toBe('technical');
    });
  });

  describe('resolveIdsByNames', () => {
    it('reuses an existing skill id when the name matches case-insensitively', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendSkill({ name: 'React' })] } });

      const ids = await skillsApi.resolveIdsByNames(['react']);

      expect(ids).toEqual(['s-1']);
      expect(mockedApi.post).not.toHaveBeenCalled();
    });

    it('creates a new skill when no existing skill matches the name', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [] } });
      mockedApi.post.mockResolvedValue({
        data: { data: backendSkill({ id: 's-new', name: 'GraphQL' }) },
      });

      const ids = await skillsApi.resolveIdsByNames(['GraphQL']);

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/skills',
        expect.objectContaining({ name: 'GraphQL', slug: 'graphql' })
      );
      expect(ids).toEqual(['s-new']);
    });

    it('skips blank/whitespace-only names', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [] } });
      const ids = await skillsApi.resolveIdsByNames(['  ', '']);
      expect(ids).toEqual([]);
      expect(mockedApi.post).not.toHaveBeenCalled();
    });

    it('returns an empty array without calling the API when given no names', async () => {
      const ids = await skillsApi.resolveIdsByNames([]);
      expect(ids).toEqual([]);
      expect(mockedApi.get).not.toHaveBeenCalled();
    });
  });

  describe('uploadIcon', () => {
    it('posts multipart form data to the icon endpoint', async () => {
      mockedApi.post.mockResolvedValue({
        data: { data: backendSkill({ icon_url: '/uploads/skills/x.png' }) },
      });

      await skillsApi.uploadIcon('s-1', new File(['x'], 'icon.png', { type: 'image/png' }));

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/skills/s-1/icon',
        expect.any(FormData),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
      );
    });
  });
});
