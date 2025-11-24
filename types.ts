export enum Channel {
  WHATSAPP = 'WhatsApp',
  EMAIL = 'Email',
  SMS = 'SMS',
}

export enum PropertyStatus {
  ACTIVE = 'Active',
  SOLD = 'Sold',
  PENDING = 'Pending',
  LEASED = 'Leased',
}

export enum LeadScore {
  HOT = 'Hot',
  WARM = 'Warm',
  COLD = 'Cold',
}

export interface Property {
  id: string;
  dldReference: string;
  title: string;
  location: string;
  price: number;
  areaSqFt: number;
  status: PropertyStatus;
  lastActionDate: string;
  leadScore: number; // 0-100
  predictedCloseProbability: number; // 0-100
  ownerName: string;
  nextRenewalDate?: string;
}

export interface CampaignStep {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay';
  label: string;
  config?: any;
  channel?: Channel;
  stats?: {
    processed: number;
    converted: number;
  };
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  steps: CampaignStep[];
  stats: {
    sent: number;
    opened: number;
    replied: number;
  };
}

export interface Template {
  id: string;
  name: string;
  channel: Channel;
  subject?: string;
  content: string;
  category: 'Inspection' | 'Renewal' | 'Sales' | 'General';
  variables: string[];
  lastModified: string;
}

export interface Activity {
  id: string;
  type: 'email' | 'whatsapp' | 'sms' | 'system' | 'ai' | 'dld';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'scheduled' | 'failed' | 'pending';
  mechanism?: string; // e.g., "Trigger: Lease Expiry Rule"
}

export interface Metric {
  label: string;
  value: string;
  trend: number; // percentage
  trendUp: boolean;
}