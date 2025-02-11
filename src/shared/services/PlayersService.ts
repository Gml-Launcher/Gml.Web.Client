import { $api } from '@/services/api.service';
import {
  TGetPlayersRequest,
  TGetPlayersResponse,
  TPostBanPlayersRequest,
  TPostBanPlayersResponse,
} from '@/shared/api/contracts';

class PlayersService {
  private BASE_URL = '/players';

  async getPlayers(params: TGetPlayersRequest): Promise<TGetPlayersResponse> {
    const { data } = await $api.get<TGetPlayersResponse>(this.BASE_URL, {
      params,
    });

    return data;
  }

  async banPlayer(body: TPostBanPlayersRequest): Promise<TPostBanPlayersResponse> {
    const { data } = await $api.post<TPostBanPlayersResponse>(`${this.BASE_URL}/ban`, body);

    return data;
  }

  async pardonPlayer(body: TPostBanPlayersRequest): Promise<TPostBanPlayersResponse> {
    const { data } = await $api.post<TPostBanPlayersResponse>(`${this.BASE_URL}/pardon`, body);

    return data;
  }

  async removePlayer(body: TPostBanPlayersRequest): Promise<TPostBanPlayersResponse> {
    const { data } = await $api.post<TPostBanPlayersResponse>(`${this.BASE_URL}/remove`, body);

    return data;
  }
}

export const playersService = new PlayersService();
