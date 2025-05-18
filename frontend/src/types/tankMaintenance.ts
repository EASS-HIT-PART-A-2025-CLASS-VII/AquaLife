export interface TankMaintenanceCreate {
  layout_id: number;
  owner_email: string;
  maintenance_date: Date;
  maintenance_type: string;
  description?: string;
  notes?: string;
  completed?: number;
}

export interface TankMaintenance extends TankMaintenanceCreate {
  id: number;
  created_at: string;
} 