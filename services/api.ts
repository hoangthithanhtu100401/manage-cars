import { API_BASE_URL } from "@/constants/config";

type ApiError = {
  status: number;
  message: string;
  data?: any;
};

async function parseJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function apiPost<T>(
  path: string,
  body: any,
  token?: string
): Promise<T> {
    console.log("API URL:", `${API_BASE_URL}${path}`);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const err: ApiError = {
      status: res.status,
      message:
        data?.message ||
        data?.error ||
        (res.status === 401 ? "Unauthorized" : "Request failed"),
      data,
    };
    throw err;
  }

  return data as T;
}
