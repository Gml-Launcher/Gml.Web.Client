import { $api } from '@/services/api.service';
import {
  ApiPostSignInRequest,
  ApiPostSignInResponse,
  ApiUserBaseEntity,
  TPostSignUpRequest,
  TPostSignUpResponse,
} from '@/shared/api/contracts';
import {
  removeStorageRecloudIDAccessToken,
  removeStorageTokens,
  setStorageAccessToken,
  setStorageProfile,
} from '@/shared/services';

class AuthService {
  private BASE_URL = '/users';

  async signUp(body: TPostSignUpRequest): Promise<TPostSignUpResponse> {
    const { data } = await $api.post<TPostSignUpResponse>(`${this.BASE_URL}/signup`, body);
    const { accessToken } = data.data;
    setStorageAccessToken(accessToken);

    const payloadRaw = accessToken.split('.')[1];
    const payload = atob(payloadRaw);

    const profile = JSON.parse(payload) as ApiUserBaseEntity;

    setStorageProfile(profile);

    return data;
  }

  async signIn(body: ApiPostSignInRequest): Promise<ApiPostSignInResponse> {
    const { data } = await $api.post<ApiPostSignInResponse>(`${this.BASE_URL}/signin`, body);
    const { accessToken } = data.data;
    setStorageAccessToken(accessToken);

    const payloadRaw = accessToken.split('.')[1];
    const payload = atob(payloadRaw);

    const profile = JSON.parse(payload) as ApiUserBaseEntity;

    setStorageProfile(profile);

    return data;
  }

  async logout() {
    removeStorageTokens();
    removeStorageRecloudIDAccessToken();
  }
}

export const authService = new AuthService();
