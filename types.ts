export interface DataPoint {
  month: string;
  score189: number;
  score190: number;
  score491: number;
  invitations: number;
  applications: number;
}

export interface Occupation {
  code: string;
  title: string;
  category: string;
  trend: 'up' | 'down' | 'stable';
  description: string;
  data: DataPoint[];
}

export enum VisaSubclass {
  SC189 = '189 - Independent',
  SC190 = '190 - State Nominated',
  SC491 = '491 - Regional',
}

export interface AIInsightResponse {
  analysis: string;
  tips: string[];
}