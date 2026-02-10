import { useCallback, useEffect, useMemo, useState } from 'react';
import { watchNetwork } from '../lib/network';
import { AppState, AcademicTask, TransitTrip } from '../types/domain';
import { taskService } from '../services/taskService';
import { transitService } from '../services/transitService';
import { syncService } from '../services/syncService';
import { storage } from '../lib/storage';

const fallbackTask: AcademicTask = {
  id: 'local-quickstart',
  course: 'General',
  title: 'Start with one tiny task',
  dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  steps: [
    { id: 'intro-1', label: 'Open your notes app', done: false, estimatedMinutes: 1 },
    { id: 'intro-2', label: 'Write one sentence goal', done: false, estimatedMinutes: 2 }
  ]
};

const fallbackTrip: TransitTrip = {
  routeName: 'Offline saved route',
  departureTime: 'Check in app',
  arrivalTime: 'Estimate pending',
  confidence: 'LOW',
  disruptions: ['No internet. Using local plan.']
};

export const useOrchestrator = () => {
  const [state, setState] = useState<AppState>({
    online: false,
    pendingSync: 0,
    transitTrip: fallbackTrip,
    primaryTask: fallbackTask,
    nextStepLabel: fallbackTask.steps[0].label,
    stressScore: 42
  });

  const recomputeStress = useCallback((task: AcademicTask) => {
    const remaining = task.steps.filter((s) => !s.done).length;
    return Math.max(10, Math.min(95, 22 + remaining * 18));
  }, []);

  const refreshDerived = useCallback((task: AcademicTask) => {
    const next = task.steps.find((step) => !step.done)?.label ?? 'You are clear. Take a short break.';
    return { nextStepLabel: next, stressScore: recomputeStress(task) };
  }, [recomputeStress]);

  useEffect(() => {
    const boot = async () => {
      const [task, trip, pending, lastSyncedAt] = await Promise.all([
        taskService.createOrFetchPrimaryTask().catch(() => fallbackTask),
        transitService.getPlan().catch(() => fallbackTrip),
        storage.getQueue().then((q) => q.length),
        storage.getLastSyncedAt()
      ]);

      const derived = refreshDerived(task);
      setState((prev) => ({
        ...prev,
        primaryTask: task,
        transitTrip: trip,
        pendingSync: pending,
        lastSyncedAt: lastSyncedAt ?? undefined,
        ...derived
      }));
    };

    boot();

    const unsubscribe = watchNetwork(async (online) => {
      const sync = await syncService.flush(online);
      setState((prev) => ({
        ...prev,
        online,
        pendingSync: sync.pending,
        lastSyncedAt: sync.lastSyncedAt
      }));
    });

    return unsubscribe;
  }, [refreshDerived]);

  const markStepDone = useCallback(async (stepId: string) => {
    const updated = await taskService.markStepDone(state.primaryTask, stepId);
    const pending = await storage.getQueue().then((q) => q.length);
    const derived = refreshDerived(updated);

    setState((prev) => ({
      ...prev,
      primaryTask: updated,
      pendingSync: pending,
      ...derived
    }));
  }, [state.primaryTask, refreshDerived]);

  const refreshTransit = useCallback(async () => {
    const trip = await transitService.refreshPlan().catch(() => transitService.getPlan());
    const pending = await storage.getQueue().then((q) => q.length);

    setState((prev) => ({
      ...prev,
      transitTrip: trip,
      pendingSync: pending
    }));
  }, []);

  const addDemoTask = useCallback(async () => {
    const task = await taskService.createOrFetchPrimaryTask().catch(() => fallbackTask);
    const derived = refreshDerived(task);

    setState((prev) => ({
      ...prev,
      primaryTask: task,
      ...derived
    }));
  }, [refreshDerived]);

  const quickResetDay = useCallback(async () => {
    await storage.clearDay();
    const sync = await syncService.enqueue({
      id: `action-${Date.now()}-reset`,
      type: 'DAY_RESET',
      payload: { reason: 'quick_reset' },
      createdAt: new Date().toISOString()
    });

    const derived = refreshDerived(fallbackTask);
    setState((prev) => ({
      ...prev,
      transitTrip: fallbackTrip,
      primaryTask: fallbackTask,
      pendingSync: sync,
      ...derived
    }));
  }, [refreshDerived]);

  const forceSync = useCallback(async () => {
    const sync = await syncService.flush(state.online);
    setState((prev) => ({
      ...prev,
      pendingSync: sync.pending,
      lastSyncedAt: sync.lastSyncedAt
    }));
  }, [state.online]);

  const stableState = useMemo(() => state, [state]);

  return {
    state: stableState,
    addDemoTask,
    markStepDone,
    refreshTransit,
    quickResetDay,
    forceSync
  };
};
