import { API_BASE_URL } from "@/constants/config";
import { authService } from "@/services/auth";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  extraHeaders?: Record<string, string>
): Promise<T> {
  const auth = await authService.getAuth(); // { token, userId, ... }
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `HTTP ${res.status} ${res.statusText}`;
    throw new Error(message);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("GET", path, undefined, headers),
  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>("POST", path, body, headers),
  put: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>("PUT", path, body, headers),
  del: <T>(path: string, headers?: Record<string, string>) =>
    request<T>("DELETE", path, undefined, headers),
};
