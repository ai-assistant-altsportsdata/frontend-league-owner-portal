export interface LeagueInfo {
  id: string;
  name: string;
  sport: string;
  established: string;
  description: string;
  website?: string;
  contactEmail: string;
  contactName: string;
  tier: 'professional' | 'semi-professional' | 'amateur' | 'youth';
  location: {
    country: string;
    region?: string;
    city?: string;
  };
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: File;
  uploadStatus: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  uploadProgress: number;
  error?: string;
  extractedData?: any;
  schema?: DataSchema;
}

export interface DataSchema {
  id: string;
  name: string;
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: { [key: string]: DataSchema };
  items?: DataSchema;
  description?: string;
  example?: any;
  required?: string[];
  format?: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  completed: boolean;
  current: boolean;
}

export interface ProcessingResult {
  fileId: string;
  success: boolean;
  schema?: DataSchema;
  extractedData?: any;
  preview?: any[];
  error?: string;
  suggestions?: string[];
}

export interface LeagueOnboardingState {
  currentStep: number;
  leagueInfo?: LeagueInfo;
  files: FileUpload[];
  schemas: DataSchema[];
  processingResults: ProcessingResult[];
  completedSteps: Set<number>;
}

export interface DashboardData {
  league: LeagueInfo;
  schemas: DataSchema[];
  files: FileUpload[];
  stats: {
    totalFiles: number;
    totalRecords: number;
    schemaComplexity: number;
    dataQuality: number;
  };
  insights: {
    dataTypes: { [key: string]: number };
    recommendations: string[];
    integrationReadiness: number;
  };
}