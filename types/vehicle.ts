export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  phone: string;
  createdAt: string;
  lastIn: string;
  lastOut: string;
  status: 'IN' | 'OUT';
  date: string;
}

export interface VehicleData {
  vehicles: Vehicle[];
}
