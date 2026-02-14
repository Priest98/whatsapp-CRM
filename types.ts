
export enum LeadStatus {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
  NEW = 'NEW'
}

export enum UserRole {
  OWNER = 'OWNER',
  STAFF = 'STAFF'
}

export enum MessageDirection {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING'
}

export enum MessageType {
  TEXT = 'TEXT',
  VOICE = 'VOICE'
}

export interface Business {
  id: string;
  name: string;
  whatsapp_phone_number: string;
  created_at: string;
}

export interface User {
  id: string;
  business_id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  token?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone_number: string;
  tags: string[];
  lead_status: LeadStatus;
  notes: string;
  created_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  business_id: string;
  customer_id: string;
  direction: MessageDirection;
  content: string;
  message_type: MessageType;
  timestamp: string;
}

export interface KnowledgeBaseItem {
  id: string;
  business_id: string;
  title: string;
  content: string;
  category: 'FAQ' | 'PRICING' | 'POLICY';
  created_at: string;
}

export interface Automation {
  id: string;
  business_id: string;
  trigger_type: string;
  action_type: string;
  delay_time: number;
  is_active: boolean;
}
