export type ComplaintCategory =
  | 'Road & Potholes'
  | 'Waste Management'
  | 'Streetlight Problems'
  | 'Water Supply & Leakage'
  | 'Drainage & Sewage'
  | 'Public Safety'
  | 'Other';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type ComplaintStatus = 'Reported' | 'In Progress' | 'Resolved';

export type Department =
  | 'Public Works Department'
  | 'Sanitation Department'
  | 'Electrical Department'
  | 'Water Supply Department'
  | 'Drainage and Sewerage Department'
  | 'Public Safety Department'
  | 'General Administration';

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  timestamp: string;
  note: string;
  actor: string;
}

export interface CitizenVerification {
  status: 'verified' | 'disputed';
  timestamp: string;
  feedback?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  locality: string;
  latitude?: number;
  longitude?: number;
  imageDataUrl?: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  department: Department;
  status: ComplaintStatus;
  aiSummary: string;
  urgencyReason: string;
  confidence: number;
  suggestedAction: string;
  analysisSource: 'Gemini' | 'Fallback';
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  corroborationCount: number;
  citizenVerification?: CitizenVerification;
  isDemo?: boolean;
  inputLanguage?: string;
}

export interface AIAnalysisResult {
  summary: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  department: Department;
  urgencyReason: string;
  confidence: number;
  suggestedAction: string;
  analysisSource: 'Gemini' | 'Fallback';
}

export interface DashboardStats {
  total: number;
  reported: number;
  inProgress: number;
  resolved: number;
  highPriority: number;
  criticalPriority: number;
  resolutionRate: number;
  citizenVerifiedCount: number;
  citizenVerifiedRate: number;
  averageResolutionHours: number;
}

