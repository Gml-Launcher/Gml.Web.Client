import Cookies from "js-cookie";

export const getStorageAccessToken = () => Cookies.get("accessToken") || null;
export const setStorageAccessToken = (token: string) => {
  Cookies.set("accessToken", token, {
    domain: process.env.BASE_URL,
    sameSite: "strict",
    expires: 1,
  });
};

export const removeStorageTokens = () => Cookies.remove("accessToken");
