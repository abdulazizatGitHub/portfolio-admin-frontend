jest.mock('../api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

import api from '../api';
import { aboutApi } from '../about.api';

const mockedApi = api as jest.Mocked<typeof api>;

describe('aboutApi', () => {
  beforeEach(() => jest.clearAllMocks());

  const backendSection = (overrides = {}) => ({
    id: 'about-1',
    role_title: 'Full Stack Developer',
    order_index: 0,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    paragraphs: [
      { id: 'p-1', content: 'First', order_index: 0 },
      { id: 'p-2', content: 'Second', order_index: 1 },
    ],
    stats: [{ id: 's-1', label: 'Projects', value: '10+', order_index: 0 }],
    ...overrides,
  });

  describe('getAll', () => {
    it('maps sections, sorting paragraphs and stats by order_index', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          data: [
            backendSection({
              paragraphs: [
                { id: 'p-2', content: 'Second', order_index: 1 },
                { id: 'p-1', content: 'First', order_index: 0 },
              ],
            }),
          ],
        },
      });

      const result = await aboutApi.getAll();

      expect(result[0]!.paragraphs).toEqual(['First', 'Second']);
      expect(result[0]!.stats).toEqual([{ id: 's-1', label: 'Projects', value: '10+' }]);
    });
  });

  describe('updateSection', () => {
    it('patches section fields when roleTitle/orderIndex change', async () => {
      mockedApi.patch.mockResolvedValue({ data: { data: backendSection() } });
      mockedApi.get.mockResolvedValue({ data: { data: [backendSection()] } });

      await aboutApi.updateSection('about-1', { roleTitle: 'New Title', orderIndex: 2 });

      expect(mockedApi.patch).toHaveBeenCalledWith(
        '/about/sections/about-1',
        expect.objectContaining({ role_title: 'New Title', order_index: 2 })
      );
    });

    it('replaces all paragraphs and stats when they are provided', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendSection()] } });
      mockedApi.delete.mockResolvedValue({ data: {} });
      mockedApi.post.mockResolvedValue({ data: { data: {} } });

      await aboutApi.updateSection('about-1', {
        paragraphs: ['Only paragraph now'],
        stats: [{ label: 'Experience', value: '5 years' }],
      });

      // Every existing paragraph and stat gets deleted...
      expect(mockedApi.delete).toHaveBeenCalledWith('/about/paragraphs/p-1');
      expect(mockedApi.delete).toHaveBeenCalledWith('/about/paragraphs/p-2');
      expect(mockedApi.delete).toHaveBeenCalledWith('/about/stats/s-1');

      // ...then recreated fresh from the submitted arrays.
      expect(mockedApi.post).toHaveBeenCalledWith('/about/sections/about-1/paragraphs', {
        content: 'Only paragraph now',
        order_index: 0,
      });
      expect(mockedApi.post).toHaveBeenCalledWith('/about/sections/about-1/stats', {
        label: 'Experience',
        value: '5 years',
        order_index: 0,
      });
    });

    it('does not touch paragraphs/stats when neither is provided', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendSection()] } });

      await aboutApi.updateSection('about-1', { roleTitle: 'Only title change' });

      expect(mockedApi.delete).not.toHaveBeenCalled();
      expect(mockedApi.post).not.toHaveBeenCalled();
    });
  });

  describe('createSection', () => {
    it('creates the section then seeds its paragraphs and stats', async () => {
      mockedApi.post.mockImplementation((url: string) => {
        if (url === '/about/sections')
          return Promise.resolve({ data: { data: { id: 'about-2' } } });
        return Promise.resolve({ data: { data: {} } });
      });
      mockedApi.get.mockResolvedValue({
        data: { data: [backendSection({ id: 'about-2', paragraphs: [], stats: [] })] },
      });

      await aboutApi.createSection({
        roleTitle: 'Designer',
        paragraphs: ['Intro'],
        stats: [{ label: 'Years', value: '3' }],
        orderIndex: 1,
      });

      expect(mockedApi.post).toHaveBeenCalledWith('/about/sections', {
        role_title: 'Designer',
        order_index: 1,
      });
      expect(mockedApi.post).toHaveBeenCalledWith('/about/sections/about-2/paragraphs', {
        content: 'Intro',
        order_index: 0,
      });
    });
  });

  describe('deleteSection', () => {
    it('calls DELETE with the section id', async () => {
      mockedApi.delete.mockResolvedValue({ data: {} });
      await aboutApi.deleteSection('about-1');
      expect(mockedApi.delete).toHaveBeenCalledWith('/about/sections/about-1');
    });
  });
});
