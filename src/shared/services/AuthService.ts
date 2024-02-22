import { $api } from "@/core/api";
import { removeStorageTokens, setStorageAccessToken } from "@/shared/services";
import {
  TPostSignInRequest,
  TPostSignInResponse,
  TPostSignUpRequest,
  TPostSignUpResponse,
} from "@/shared/api/contracts";

class AuthService {
  private BASE_URL = "/users";

  async signUp(body: TPostSignUpRequest): Promise<TPostSignUpResponse> {
    const { data } = await $api.post<TPostSignUpResponse>(`${this.BASE_URL}/signup`, body);

    setStorageAccessToken(data.data.accessToken);

    return data;
  }

  async signIn(body: TPostSignInRequest): Promise<TPostSignInResponse> {
    const { data } = await $api.post<TPostSignInResponse>(`${this.BASE_URL}/signin`, body);

    setStorageAccessToken(data.data.accessToken);

    return data;
  }

  async logout() {
    removeStorageTokens();
  }
}

export const authService = new AuthService();
