import { $api } from '@/services/api.service';
import {
  TPostSignInRequest,
  TPostSignInResponse,
  TPostSignUpRequest,
  TPostSignUpResponse,
} from '@/shared/api/contracts';
import { removeStorageTokens, removeStorageRecloudIDAccessToken, setStorageAccessToken, setStorageProfile } from '@/shared/services';

class AuthService {
  private BASE_URL = '/users';

  async signUp(body: TPostSignUpRequest): Promise<TPostSignUpResponse> {
    const { data } = await $api.post<TPostSignUpResponse>(`${this.BASE_URL}/signup`, body);
    const { accessToken, ...profile } = data.data;
    setStorageAccessToken(accessToken);
    setStorageProfile(profile);

    return data;
  }

  async signIn(body: TPostSignInRequest): Promise<TPostSignInResponse> {
    const { data } = await $api.post<TPostSignInResponse>(`${this.BASE_URL}/signin`, body);
    const { accessToken, ...profile } = data.data;
    setStorageAccessToken(accessToken);
    setStorageProfile(profile);

    return data;
  }

  async logout() {
    removeStorageTokens();
    removeStorageRecloudIDAccessToken();
  }
}

export const authService = new AuthService();
