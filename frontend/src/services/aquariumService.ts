import { API_BASE_URL, API_URL } from '../config';

export class AquariumService {
  static async getLayoutsByOwner(ownerEmail: string) {
    const response = await fetch(`${API_BASE_URL}${API_URL}/aquariums/by-owner/${ownerEmail}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch aquarium layouts');
    }
    return response.json();
  }

  static async getLayout(id: number) {
    const response = await fetch(`${API_BASE_URL}${API_URL}/aquariums/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch aquarium layout');
    }
    return response.json();
  }

  static async createLayout(layout: any) {
    const response = await fetch(`${API_BASE_URL}${API_URL}/aquariums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(layout),
    });
    if (!response.ok) {
      throw new Error('Failed to create aquarium layout');
    }
    return response.json();
  }

  static async updateLayout(id: number, layout: any) {
    const response = await fetch(`${API_BASE_URL}${API_URL}/aquariums/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(layout),
    });
    if (!response.ok) {
      throw new Error('Failed to update aquarium layout');
    }
    return response.json();
  }

  static async deleteLayout(id: number) {
    const response = await fetch(`${API_BASE_URL}${API_URL}/aquariums/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      let errorMessage = 'Failed to delete aquarium layout';
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        // If we can't parse the error response, use the default message
      }
      throw new Error(errorMessage);
    }
    return response.json();
  }
} 