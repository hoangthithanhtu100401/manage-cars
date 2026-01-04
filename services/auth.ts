import { apiPost } from "@/services/api";

export type LoginResponse = any; // bạn có thể type chặt sau khi biết response thật

export async function loginApi(username: string, password: string) {
  const data = await apiPost<LoginResponse>("/api/v1/login", {
    username,
    password,
  });

  // Backend trả token key gì thì bạn map ở đây:
  const token =
    data?.token ||
    data?.access_token ||
    data?.accessToken ||
    data?.jwt ||
    data?.data?.token;

  if (!token) {
    // để bạn dễ debug nếu API trả structure khác
    throw { status: 500, message: "Token not found in response", data };
  }

  return { token, raw: data };
}
