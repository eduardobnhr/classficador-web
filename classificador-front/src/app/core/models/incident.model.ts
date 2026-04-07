export type IncidentStatus = 'pending' | 'classifying' | 'classified' | 'error';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Category =
  | 'phishing'
  | 'malware'
  | 'brute_force'
  | 'ddos'
  | 'data_leak'
  | 'unauthorized_access';

export interface Classification {
  id: string;
  incidentId: string;
  category: Category;
  severity: Severity;
  confidenceScore: number;
  explanation?: string;
  recommendedActions?: string[];
  modelVersion?: string;
  classifiedAt: string;
}

export interface Incident {
  id: string;
  userId: string;
  title: string;
  description: string;
  affectedAsset?: string;
  occurredAt?: string;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  classification?: Classification;
}
