export type CategoryType = 'BASIC' | 'PLUS' | 'VIP';

export interface AvailabilityItem {
  category: CategoryType;
  capacity: number;
  reserved: number;
  available: number;
  price: number;
}
