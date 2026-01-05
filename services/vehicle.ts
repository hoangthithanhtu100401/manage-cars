import { apiPost } from "./api";
import { authService } from "./authService";

export type VehicleStatus = "IN" | "OUT";

export type CreateVehicleBody = {
  plateNumber: string;
  licenseNumber: string;
  owner: string;
  phone: string;
  vehicleStatus: VehicleStatus;
};

export type CreateVehicleResponse = {
  code: number;
  data: {
    id: number;
    plateNumber: string;
    licenseNumber: string;
    ownerName: string;
    phone: string;
    createdAt: string;
    lastIn: string;
    lastOut: string;
    status: VehicleStatus;
  };
  message: string;
};

export async function createVehicleApi(body: CreateVehicleBody) {
  const token = await authService.getToken();

  if (!token) throw new Error("NO_TOKEN");

  // API của bạn cần employeeId là query param
  const path = `/api/v1/vehicle`;

  return apiPost(path, body, token) as Promise<CreateVehicleResponse>;
}
