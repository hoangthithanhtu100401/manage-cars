// services/authService.ts
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "AUTH_SESSION_V1";

export type AuthSession = {
  userId: number;
  token: string;
  refreshToken?: string | null;
  displayName?: string | null;
  expiration?: number | null;
};

export const authService = {
  async saveAuth(session: AuthSession) {
    await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(session));
  },

  async getAuth(): Promise<AuthSession | null> {
    const raw = await SecureStore.getItemAsync(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      return null;
    }
  },

  async clearAuth() {
    await SecureStore.deleteItemAsync(AUTH_KEY);
  },

  async getUserId(): Promise<number | null> {
    const auth = await this.getAuth();
    return auth?.userId ?? null;
  },

  async getToken(): Promise<string | null> {
    const auth = await this.getAuth();
    return auth?.token ?? null;
  },
};
