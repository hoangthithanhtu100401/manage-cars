import * as FileSystem from 'expo-file-system/legacy';
import { Vehicle, VehicleData } from '../types/vehicle';

const DATA_FILE = `${FileSystem.documentDirectory}vehicles.json`;

export const storageService = {
  async loadVehicles(): Promise<Vehicle[]> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(DATA_FILE);
      if (!fileInfo.exists) {
        await this.saveVehicles([]);
        return [];
      }
      
      const content = await FileSystem.readAsStringAsync(DATA_FILE);
      const data: VehicleData = JSON.parse(content);
      return data.vehicles || [];
    } catch (error) {
      console.error('Error loading vehicles:', error);
      return [];
    }
  },

  async saveVehicles(vehicles: Vehicle[]): Promise<void> {
    try {
      const data: VehicleData = { vehicles };
      await FileSystem.writeAsStringAsync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving vehicles:', error);
      throw error;
    }
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> {
    const vehicles = await this.loadVehicles();
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
    };
    vehicles.push(newVehicle);
    await this.saveVehicles(vehicles);
    return newVehicle;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<void> {
    const vehicles = await this.loadVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updates };
      await this.saveVehicles(vehicles);
    }
  },

  async deleteVehicle(id: string): Promise<void> {
    const vehicles = await this.loadVehicles();
    const filteredVehicles = vehicles.filter(v => v.id !== id);
    await this.saveVehicles(filteredVehicles);
  },

  async searchVehicles(query: string): Promise<Vehicle[]> {
    const vehicles = await this.loadVehicles();
    if (!query.trim()) return vehicles;
    
    const lowerQuery = query.toLowerCase();
    return vehicles.filter(v => 
      v.licensePlate.toLowerCase().includes(lowerQuery)
    );
  },

  async updateVehicleStatus(id: string, status: 'IN' | 'OUT'): Promise<void> {
    await this.updateVehicle(id, { status });
  }
};
