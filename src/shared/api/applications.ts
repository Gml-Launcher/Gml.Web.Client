import { $api } from '@/services/api.service';
import { 
  ExternalApplicationCreateDto, 
  ExternalApplicationListDto, 
  ExternalApplicationReadDto,
  TGetApplicationsResponse,
  TPostApplicationResponse,
  TDeleteApplicationResponse
} from '@/shared/api/contracts';

export const applicationsApi = {
  /**
   * Get all applications for the current user
   */
  async getApplications(): Promise<ExternalApplicationListDto[]> {
    const { data } = await $api.get<TGetApplicationsResponse>('/applications');
    return data.data;
  },

  /**
   * Create a new external application
   */
  async createApplication(payload: ExternalApplicationCreateDto): Promise<ExternalApplicationReadDto> {
    const { data } = await $api.post<TPostApplicationResponse>('/applications', payload);
    return data.data;
  },

  /**
   * Delete an external application
   */
  async deleteApplication(id: string): Promise<void> {
    await $api.delete<TDeleteApplicationResponse>(`/applications/${id}`);
  }
};