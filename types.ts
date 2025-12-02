export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  major: string;
  gpa: number;
  status: 'Active' | 'Probation' | 'Graduated' | 'Dropped';
  enrollment_date: string;
  avatar_url?: string;
}

export interface DatabaseConfig {
  connectionString: string;
  ssl: boolean;
}

export interface SqlQueryResult {
  query: string;
  results: any[];
  timestamp: string;
  executionTimeMs: number;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  STUDENTS = 'STUDENTS',
  AI_SQL = 'AI_SQL',
  SETTINGS = 'SETTINGS',
}