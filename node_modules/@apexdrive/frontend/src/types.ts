export interface City { name: string; }

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: string;
  fuel: string;
  transmission: string;
  seats: number;
  bags: number;
  dailyPricePaise: number;
  mileage: string;
  engine: string;
  description: string;
  badge: string;
  badgeIcon: string;
  badgeTag: string | null;
  image: string;
  fallback: string;
  features: string[];
  cities: string[];
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface CarDetail extends Car { reviews: Review[]; }

export interface BookingSummary {
  reference: string;
  carId: string;
  city: string;
  start: string;
  end: string;
  days?: number;
  subtotalPaise?: number;
  gstPaise?: number;
  totalPaise: number;
  status: "confirmed" | "cancelled";
  phoneMasked?: string;
  name?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
}