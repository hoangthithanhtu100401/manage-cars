// services/vehicleService.ts
import { apiPost } from "@/services/api";
import { getToken } from "@/services/token";
import { apiDelete } from "@/services/api"; 
import {apiPut} from "@/services/api";
import { authService } from "@/services/authService";

export type UpdateVehicleBody = {
  plateNumber: string;
  licenseNumber: string;  
  owner: string;
  phone: string;
  vehicleStatus: "IN" | "OUT";
};


export const vehicleService = {
  async updateStatus(params: { vehicleId: number; employeeId: number; status: "IN" | "OUT" }) {
    const auth = await authService.getAuth();
    const token = auth?.token;    const qs = new URLSearchParams({
      vehicleId: String(params.vehicleId),
      employeeId: String(params.employeeId),
      status: params.status,
    }).toString();

    // nhiều backend không cần body cho endpoint này
    return apiPost(`/api/v1/vehicle/status?${qs}`, {}, token ?? undefined);
  },
  async deleteById(vehicleId: number) {
    const auth = await authService.getAuth();
    const token = auth?.token;
    return apiDelete(`/api/v1/vehicle?vehicleId=${vehicleId}`, token ?? undefined);
  },
  async updateVehicle(vehicleId: number, body: UpdateVehicleBody) {
    const auth = await authService.getAuth();
    const token = auth?.token;
    return apiPut(`/api/v1/vehicle/${vehicleId}`, body, token ?? undefined);
}
};
