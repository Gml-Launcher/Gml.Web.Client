import { $api } from '@/services/api.service';
import { TGetBackendVersionResponse } from '@/shared/api/contracts';

class SystemService {
  async getVersion() {
    const { data } = await $api.get<TGetBackendVersionResponse>('/system/version');
    return data.data;
  }
}

export const systemService = new SystemService();
