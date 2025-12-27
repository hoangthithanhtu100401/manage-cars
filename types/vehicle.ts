export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  phone: string;
  dateAdded: string;
  status: 'IN' | 'OUT';
}

export interface VehicleData {
  vehicles: Vehicle[];
}
