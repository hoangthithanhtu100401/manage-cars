import { apiPost } from "@/services/api";

export type LoginResponse = {
  userId: number;
  displayName: string;
  providerId: string | null;
  expiration: number;
  token: string;
  refreshToken: string;
  role: string[];
  photoURL: string | null;
};

function unwrap<T>(res: any): T {
  return (res?.data ?? res) as T;
}

export async function loginApi(username: string, password: string) {
  const res = await apiPost<LoginResponse | { data: LoginResponse }>(
    "/api/v1/login",
    { username, password }
  );

  const data = unwrap<LoginResponse>(res);

  const token = data?.token;
  const refreshToken = data?.refreshToken;
  const userId = data?.userId;

  if (!token || !userId) {
    throw new Error("Login response missing token/userId");
  }

  return {
    token,
    refreshToken,
    userId,
    displayName: data.displayName,
    expiration: data.expiration,
    roles: data.role ?? [],
    raw: data,
  };
}
