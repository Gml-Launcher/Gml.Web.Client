import { $api } from "@/core/api";
import { TGetPlayersRequest, TGetPlayersResponse } from "@/shared/api/contracts";

class PlayersService {
  private BASE_URL = "/players";

  async getPlayers(params: TGetPlayersRequest): Promise<TGetPlayersResponse> {
    const { data } = await $api.get<TGetPlayersResponse>(this.BASE_URL, {
      params,
    });

    return data;
  }
}

export const playersService = new PlayersService();
