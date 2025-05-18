export interface FishEntry {
  name: string;
  quantity: number;
}

export interface AquaLayoutCreate {
  owner_email: string;
  tank_name: string;
  tank_length: number;
  tank_width: number;
  tank_height: number;
  water_type: string;
  fish_data: FishEntry[];
  comments?: string;
}

export interface AquaLayout extends AquaLayoutCreate {
  id: number;
  created_at: string;
} 