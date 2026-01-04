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

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  console.log("API URL:", `${API_BASE_URL}${path}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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

export async function apiDelete<T>(path: string, token?: string): Promise<T> {
  console.log("API URL:", `${API_BASE_URL}${path}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw { status: res.status, data };
  }
  return data as T;
}

export async function apiPut<T>(
  path: string,
  body: any,
  token?: string
): Promise<T> {
  console.log("API URL:", `${API_BASE_URL}${path}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
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

  // nhiều API PUT trả body rỗng -> đảm bảo không bị undefined
  return (data ?? ({} as any)) as T;
}


