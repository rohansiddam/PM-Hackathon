export type ApiSource = 'UTA' | 'GOOGLE_MAPS' | 'CANVAS' | 'FIREBASE' | 'LOCATION';

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

export type DeconstructedTaskPlan = {
  id: string;
  sourceDescription: string;
  createdAt: string;
  steps: TaskStep[];
};

export type WorkingTimerState = {
  isRunning: boolean;
  startedAt?: string;
  accumulatedSeconds: number;
};

export type WorkingModeState = {
  plan: DeconstructedTaskPlan;
  activeStepIndex: number;
  timer: WorkingTimerState;
};

export type HubId = 'WEB' | 'LNCO';

export type HubBuilding = {
  id: HubId;
  code: string;
  name: string;
  majorTrack: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
};

export type HubMember = {
  id: string;
  initials: string;
  majorTrack: string;
  isYou?: boolean;
  lastActiveAt: string;
};

export type SilentCoworkingRoom = {
  hubId: HubId;
  hubCode: string;
  hubName: string;
  majorTrack: string;
  members: HubMember[];
  updatedAt: string;
};

export type SyncActionType =
  | 'TASK_CREATED'
  | 'TASK_STEP_COMPLETED'
  | 'TRANSIT_REFRESHED'
  | 'DAY_RESET'
  | 'TASK_DECONSTRUCTED'
  | 'WORKING_STEP_COMPLETED'
  | 'WORKING_MODE_EXITED'
  | 'HUB_DETECTED'
  | 'HUB_ROOM_REFRESHED'
  | 'HUB_ROOM_VIEWED';

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
  activeView: 'HOME' | 'WORKING' | 'HUB';
  workingMode?: WorkingModeState;
  currentHub?: HubBuilding;
  hubRoom?: SilentCoworkingRoom;
};
