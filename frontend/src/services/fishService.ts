import { API_BASE_URL } from '../config';

export class FishService {
  static async getAllFish() {
    const response = await fetch(`${API_BASE_URL}/fish`);
    if (!response.ok) {
      throw new Error('Failed to fetch fish catalog');
    }
    return response.json();
  }

  static async getFishById(id: number) {
    const response = await fetch(`${API_BASE_URL}/fish/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch fish');
    }
    return response.json();
  }

  static async getFishByName(name: string) {
    const response = await fetch(`${API_BASE_URL}/fish/name/${name}`);
    if (!response.ok) {
      throw new Error('Failed to fetch fish');
    }
    return response.json();
  }
} 