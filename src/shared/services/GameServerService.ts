import { $api } from '@/services/api.service';
import {
  TDeleteGameServersRequest,
  TDeleteGameServersResponse,
  TGetGameServersRequest,
  TGetGameServersResponse,
  TPostGameServersRequest,
  TPostGameServersResponse,
  TPutGameServersRequest,
  TPutGameServersResponse,
} from '@/shared/api/contracts';

class GameServerService {
  private BASE_URL = '/servers';

  async getServers({ profileName }: TGetGameServersRequest): Promise<TGetGameServersResponse> {
    const { data } = await $api.get<TGetGameServersResponse>(`${this.BASE_URL}/${profileName}`);

    return data;
  }

  async addServer({
    profileName,
    ...body
  }: TPostGameServersRequest): Promise<TPostGameServersResponse> {
    const { data } = await $api.post<TPostGameServersResponse>(
      `${this.BASE_URL}/${profileName}`,
      body,
    );
    return data;
  }

  async deleteServer(body: TDeleteGameServersRequest): Promise<TDeleteGameServersResponse> {
    const { data } = await $api.delete<TDeleteGameServersResponse>(
      `${this.BASE_URL}/${body.profileName}/${body.serverName}`,
    );

    return data;
  }

  async updateServer({
    profileName,
    serverName,
    ...body
  }: TPutGameServersRequest): Promise<TPutGameServersResponse> {
    const { data } = await $api.put<TPutGameServersResponse>(
      `${this.BASE_URL}/${profileName}/${serverName}`,
      body,
    );
    return data;
  }
}

export const gameServerService = new GameServerService();
