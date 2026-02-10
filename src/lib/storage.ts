import AsyncStorage from '@react-native-async-storage/async-storage';
import { AcademicTask, SyncAction, TransitTrip, WorkingModeState } from '../types/domain';

const KEYS = {
  task: '@chronos/task',
  trip: '@chronos/trip',
  queue: '@chronos/sync-queue',
  lastSyncedAt: '@chronos/last-synced',
  workingMode: '@chronos/working-mode'
} as const;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getTask: () => readJson<AcademicTask | null>(KEYS.task, null),
  setTask: (task: AcademicTask) => writeJson(KEYS.task, task),

  getTrip: () => readJson<TransitTrip | null>(KEYS.trip, null),
  setTrip: (trip: TransitTrip) => writeJson(KEYS.trip, trip),

  getQueue: () => readJson<SyncAction[]>(KEYS.queue, []),
  setQueue: (queue: SyncAction[]) => writeJson(KEYS.queue, queue),

  getWorkingMode: () => readJson<WorkingModeState | null>(KEYS.workingMode, null),
  setWorkingMode: (workingMode: WorkingModeState) => writeJson(KEYS.workingMode, workingMode),
  clearWorkingMode: () => AsyncStorage.removeItem(KEYS.workingMode),

  getLastSyncedAt: () => AsyncStorage.getItem(KEYS.lastSyncedAt),
  setLastSyncedAt: (value: string) => AsyncStorage.setItem(KEYS.lastSyncedAt, value),

  clearDay: async () => {
    await AsyncStorage.multiRemove([KEYS.task, KEYS.trip]);
  }
};
