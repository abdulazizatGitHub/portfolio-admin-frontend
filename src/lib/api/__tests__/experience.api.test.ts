jest.mock('../api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn(), delete: jest.fn() },
}));

import api from '../api';
import { experienceApi } from '../experience.api';

const mockedApi = api as jest.Mocked<typeof api>;

describe('experienceApi', () => {
  beforeEach(() => jest.clearAllMocks());

  const backendExperience = (overrides = {}) => ({
    id: 'exp-1',
    organization: 'Acme Corp',
    location: 'Remote',
    employment_type: 'FULL_TIME',
    summary: 'Led engineering efforts',
    order_index: 0,
    roles: [
      {
        id: 'role-1',
        job_title: 'Senior Engineer',
        start_date: '2022-03-15T00:00:00.000Z',
        end_date: null,
        description: 'Led the platform team',
        order_index: 0,
      },
    ],
    ...overrides,
  });

  describe('getAll', () => {
    it('maps org + roles and truncates ISO dates to YYYY-MM', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendExperience()] } });

      const result = await experienceApi.getAll();

      expect(result[0]).toMatchObject({
        id: 'exp-1',
        organization: 'Acme Corp',
        location: 'Remote',
        employmentType: 'full_time',
        summary: 'Led engineering efforts',
      });
      expect(result[0]!.roles[0]).toMatchObject({
        id: 'role-1',
        jobTitle: 'Senior Engineer',
        startDate: '2022-03',
        endDate: null,
        isCurrent: true,
      });
    });

    it('marks a role as not current when it has an end date', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          data: [
            backendExperience({
              roles: [
                {
                  id: 'role-2',
                  job_title: 'Junior Engineer',
                  start_date: '2020-01-01T00:00:00.000Z',
                  end_date: '2022-03-01T00:00:00.000Z',
                  description: 'Early role',
                  order_index: 0,
                },
              ],
            }),
          ],
        },
      });

      const result = await experienceApi.getAll();
      expect(result[0]!.roles[0]).toMatchObject({ endDate: '2022-03', isCurrent: false });
    });

    it('computes overallPeriod from the roles', async () => {
      mockedApi.get.mockResolvedValue({ data: { data: [backendExperience()] } });
      const result = await experienceApi.getAll();
      expect(result[0]!.overallPeriod).toContain('Present');
    });
  });

  describe('createRole/updateRole', () => {
    it('expands a YYYY-MM start date to a full ISO-ish date string for the backend', async () => {
      mockedApi.post.mockResolvedValue({
        data: {
          data: {
            id: 'role-3',
            job_title: 'New Role',
            start_date: '2024-06-01T00:00:00.000Z',
            end_date: null,
            description: 'desc',
            order_index: 0,
          },
        },
      });

      await experienceApi.createRole('exp-1', {
        jobTitle: 'New Role',
        startDate: '2024-06',
        endDate: null,
        description: 'desc',
        orderIndex: 0,
      });

      expect(mockedApi.post).toHaveBeenCalledWith(
        '/timeline/experience/exp-1/roles',
        expect.objectContaining({ job_title: 'New Role', start_date: '2024-06-01', end_date: null })
      );
    });
  });

  describe('deleteRole', () => {
    it('calls DELETE with the role id', async () => {
      mockedApi.delete.mockResolvedValue({ data: {} });
      await experienceApi.deleteRole('role-1');
      expect(mockedApi.delete).toHaveBeenCalledWith('/timeline/experience/roles/role-1');
    });
  });
});
