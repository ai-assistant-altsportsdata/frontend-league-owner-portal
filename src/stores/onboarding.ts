import { create } from 'zustand';
import { LeagueOnboardingState, LeagueInfo, FileUpload, DataSchema, ProcessingResult, OnboardingStep } from '@/types/league';

interface OnboardingStore extends LeagueOnboardingState {
  // State setters
  setCurrentStep: (step: number) => void;
  setLeagueInfo: (info: LeagueInfo) => void;
  addFile: (file: FileUpload) => void;
  updateFile: (fileId: string, updates: Partial<FileUpload>) => void;
  removeFile: (fileId: string) => void;
  addSchema: (schema: DataSchema) => void;
  addProcessingResult: (result: ProcessingResult) => void;
  completeStep: (stepIndex: number) => void;
  reset: () => void;

  // Computed values
  getSteps: () => OnboardingStep[];
  canProceedToNext: () => boolean;
  getCurrentStepData: () => OnboardingStep | null;
}

const initialState: LeagueOnboardingState = {
  currentStep: 0,
  leagueInfo: undefined,
  files: [],
  schemas: [],
  processingResults: [],
  completedSteps: new Set(),
};

const ONBOARDING_STEPS: Omit<OnboardingStep, 'completed' | 'current'>[] = [
  {
    id: 'league-info',
    title: 'League Information',
    description: 'Tell us about your league',
    component: 'LeagueInfoForm',
  },
  {
    id: 'file-upload',
    title: 'Upload Data Files',
    description: 'Drop your CSV, JSON, or Excel files',
    component: 'FileUploadZone',
  },
  {
    id: 'data-processing',
    title: 'Data Processing',
    description: 'We\'re analyzing your data structure',
    component: 'DataProcessing',
  },
  {
    id: 'schema-review',
    title: 'Review Data Schema',
    description: 'Verify the detected data structure',
    component: 'SchemaReview',
  },
  {
    id: 'dashboard-preview',
    title: 'Dashboard Preview',
    description: 'Preview your league dashboard',
    component: 'DashboardPreview',
  },
];

export const useOnboardingStore = create<OnboardingStore>((set, get) => ({
  ...initialState,

  setCurrentStep: (step: number) => {
    set({ currentStep: Math.max(0, Math.min(step, ONBOARDING_STEPS.length - 1)) });
  },

  setLeagueInfo: (info: LeagueInfo) => {
    set({ leagueInfo: info });
  },

  addFile: (file: FileUpload) => {
    set((state) => ({
      files: [...state.files, file],
    }));
  },

  updateFile: (fileId: string, updates: Partial<FileUpload>) => {
    set((state) => ({
      files: state.files.map((file) =>
        file.id === fileId ? { ...file, ...updates } : file
      ),
    }));
  },

  removeFile: (fileId: string) => {
    set((state) => ({
      files: state.files.filter((file) => file.id !== fileId),
    }));
  },

  addSchema: (schema: DataSchema) => {
    set((state) => ({
      schemas: [...state.schemas, schema],
    }));
  },

  addProcessingResult: (result: ProcessingResult) => {
    set((state) => ({
      processingResults: [...state.processingResults, result],
    }));
  },

  completeStep: (stepIndex: number) => {
    set((state) => ({
      completedSteps: new Set([...Array.from(state.completedSteps), stepIndex]),
    }));
  },

  reset: () => {
    set(initialState);
  },

  getSteps: () => {
    const state = get();
    return ONBOARDING_STEPS.map((step, index) => ({
      ...step,
      completed: state.completedSteps.has(index),
      current: state.currentStep === index,
    }));
  },

  canProceedToNext: () => {
    const state = get();
    const { currentStep, leagueInfo, files, processingResults } = state;

    switch (currentStep) {
      case 0: // League info
        return !!leagueInfo?.name && !!leagueInfo?.sport && !!leagueInfo?.contactEmail;
      case 1: // File upload
        return files.length > 0 && files.every(f => f.uploadStatus === 'completed');
      case 2: // Data processing
        return processingResults.length > 0 && processingResults.every(r => r.success);
      case 3: // Schema review
        return state.schemas.length > 0;
      case 4: // Dashboard preview
        return true; // Last step
      default:
        return false;
    }
  },

  getCurrentStepData: () => {
    const state = get();
    const steps = get().getSteps();
    return steps[state.currentStep] || null;
  },
}));