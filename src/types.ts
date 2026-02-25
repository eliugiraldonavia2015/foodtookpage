export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'banned' | 'pending_approval';
  role: 'admin' | 'restaurant' | 'staff' | 'rider' | 'user';
  staffRole?: 'Secretario' | 'Ventas' | 'Servicio al cliente' | 'Legal' | 'Financiero' | 'Inversor' | 'Onboarding Supervisor';
  joinedDate: string;
  phone?: string;
  address?: string;
  country?: string;
  province?: string;
  ruc?: string;
  // New User Metrics
  ltv?: number;
  frequency?: number; // Orders per month
  engagementScore?: number; // 0-100
  riskFlag?: 'low' | 'medium' | 'high';
}

export interface Restaurant extends User {
  // New Restaurant Metrics
  gmv?: number;
  marginContribution?: number; // %
  conversionRate?: number; // %
  ordersFromStories?: number; // %
  adsSpend?: number;
  dependencyIndex?: number; // 0-100
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  category: string;
  restaurantId: string;
  restaurantName: string;
  image: string;
  description: string;
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  rejectionReason?: string;
  submittedAt?: string;
}

export interface RestaurantRequest {
  id: string;
  restaurantName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  province: string;
  submittedAt: string;
  status: 'pending' | 'second_attempt' | 'approved' | 'rejected';
  documents?: string[]; // URLs to docs
}

export interface SupportTicket {
  id: string;
  type: 'client' | 'restaurant' | 'rider';
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  lastUpdate: string;
  category: string;
  assignedTo?: string; // Staff name or ID
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export type Tab = 
  | 'command-center' 
  | 'growth' 
  | 'attention-content' 
  | 'operations' 
  | 'quality-risk' 
  | 'financial-control' 
  | 'geography-intelligence' 
  | 'users-restaurants' 
  | 'content-product-governance' 
  | 'dish-requests' 
  | 'restaurant-requests';
