import { TankMaintenanceCreate } from '../types/tankMaintenance';
import { API_BASE_URL } from '../config';

export class TankMaintenanceService {
  static async create(maintenance: TankMaintenanceCreate) {
    const response = await fetch(`${API_BASE_URL}/maintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maintenance),
    });
    if (!response.ok) {
      throw new Error('Failed to create maintenance entry');
    }
    return response.json();
  }

  static async getByOwner(ownerEmail: string) {
    const response = await fetch(`${API_BASE_URL}/maintenance/owner/${ownerEmail}`);
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance entries');
    }
    return response.json();
  }

  static async getByLayout(layoutId: number) {
    const response = await fetch(`${API_BASE_URL}/maintenance/layout/${layoutId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance entries');
    }
    return response.json();
  }

  static async update(id: number, maintenance: Partial<TankMaintenanceCreate>) {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(maintenance),
    });
    if (!response.ok) {
      throw new Error('Failed to update maintenance entry');
    }
    return response.json();
  }

  static async delete(id: number) {
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete maintenance entry');
    }
    return response.json();
  }
} 