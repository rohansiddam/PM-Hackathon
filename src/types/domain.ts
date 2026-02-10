export type ApiSource = 'UTA' | 'GOOGLE_MAPS' | 'CANVAS';

export type TransitTrip = {
  routeName: string;
  departureTime: string;
  arrivalTime: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  disruptions: string[];
};

export type TaskStep = {
  id: string;
  label: string;
  done: boolean;
  estimatedMinutes: number;
};

export type AcademicTask = {
  id: string;
  course: string;
  title: string;
  dueAt: string;
  steps: TaskStep[];
};

export type SyncActionType =
  | 'TASK_CREATED'
  | 'TASK_STEP_COMPLETED'
  | 'TRANSIT_REFRESHED'
  | 'DAY_RESET';

export type SyncAction = {
  id: string;
  type: SyncActionType;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type AppState = {
  online: boolean;
  pendingSync: number;
  lastSyncedAt?: string;
  transitTrip: TransitTrip;
  primaryTask: AcademicTask;
  nextStepLabel: string;
  stressScore: number;
};
