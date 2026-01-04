    import { apiPost } from "@/services/api";

export type RegisterPayload = {
  name: string;
  password: string;
  role: "admin" | "user";
  phone: string;
  email: string;
};

export type RegisterResponse = {
  data: any;
  message?: string;
  status?: string;
};

export async function registerApi(payload: RegisterPayload) {
  return await apiPost<RegisterResponse>("/api/v1/register", payload);
}
