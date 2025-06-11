import { Fish } from '../types/fish';
import { API_BASE_URL } from '../config';

const API_URL = '/api/fish';

export class FishService {
  static async getAllFish(): Promise<Fish[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fish:', error);
      return [];
    }
  }

  static async getFishByWaterType(waterType: 'freshwater' | 'saltwater'): Promise<Fish[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}/by-water-type/${waterType}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${waterType} fish:`, error);
      return [];
    }
  }

  static async getFishById(id: number): Promise<Fish | null> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching fish by ID:', error);
      return null;
    }
  }

  static async searchFish(query: string): Promise<Fish[]> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching fish:', error);
      return [];
    }
  }

  static async createFish(fish: Omit<Fish, 'id'>): Promise<Fish | null> {
    try {
      const response = await fetch(`${API_BASE_URL}${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fish),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating fish:', error);
      return null;
    }
  }
} 