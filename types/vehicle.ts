export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  phone: string;
  createdAt: string;
  status: 'IN' | 'OUT';
}

export interface VehicleData {
  vehicles: Vehicle[];
}
