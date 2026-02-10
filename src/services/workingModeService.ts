import { storage } from '../lib/storage';
import { SyncAction, WorkingModeState } from '../types/domain';
import { syncService } from './syncService';
import { taskDeconstructorService } from './taskDeconstructorService';

const makeAction = (type: SyncAction['type'], payload: Record<string, unknown>): SyncAction => ({
  id: `action-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  payload,
  createdAt: new Date().toISOString()
});

export const getElapsedSeconds = (workingMode: WorkingModeState, nowMs = Date.now()): number => {
  if (!workingMode.timer.isRunning || !workingMode.timer.startedAt) {
    return workingMode.timer.accumulatedSeconds;
  }

  const runningSeconds = Math.max(0, Math.floor((nowMs - new Date(workingMode.timer.startedAt).getTime()) / 1000));
  return workingMode.timer.accumulatedSeconds + runningSeconds;
};

const withStoppedTimer = (workingMode: WorkingModeState): WorkingModeState => ({
  ...workingMode,
  timer: {
    isRunning: false,
    accumulatedSeconds: getElapsedSeconds(workingMode)
  }
});

export const workingModeService = {
  startFromDescription: async (description: string): Promise<WorkingModeState> => {
    const plan = taskDeconstructorService.deconstruct(description);
    const workingMode = taskDeconstructorService.createWorkingMode(plan);

    await storage.setWorkingMode(workingMode);
    await syncService.enqueue(
      makeAction('TASK_DECONSTRUCTED', {
        planId: plan.id,
        sourceDescription: description
      })
    );

    return workingMode;
  },

  resume: () => storage.getWorkingMode(),

  toggleTimer: async (workingMode: WorkingModeState): Promise<WorkingModeState> => {
    const nowIso = new Date().toISOString();

    const updated: WorkingModeState = workingMode.timer.isRunning
      ? withStoppedTimer(workingMode)
      : {
          ...workingMode,
          timer: {
            ...workingMode.timer,
            isRunning: true,
            startedAt: nowIso
          }
        };

    await storage.setWorkingMode(updated);
    return updated;
  },

  completeActiveStep: async (workingMode: WorkingModeState): Promise<WorkingModeState> => {
    const activeStep = workingMode.plan.steps[workingMode.activeStepIndex];
    if (!activeStep) {
      return workingMode;
    }

    const updatedSteps = workingMode.plan.steps.map((step, index) => {
      if (index !== workingMode.activeStepIndex) {
        return step;
      }

      return {
        ...step,
        done: true
      };
    });

    const nextIndex = Math.min(workingMode.activeStepIndex + 1, updatedSteps.length - 1);
    const allDone = updatedSteps.every((step) => step.done);

    let updated: WorkingModeState = {
      ...workingMode,
      plan: {
        ...workingMode.plan,
        steps: updatedSteps
      },
      activeStepIndex: nextIndex
    };

    if (allDone) {
      updated = withStoppedTimer(updated);
    }

    await storage.setWorkingMode(updated);
    await syncService.enqueue(
      makeAction('WORKING_STEP_COMPLETED', {
        planId: workingMode.plan.id,
        stepId: activeStep.id,
        doneCount: updatedSteps.filter((step) => step.done).length
      })
    );

    return updated;
  },

  clear: async (workingMode: WorkingModeState): Promise<void> => {
    await storage.clearWorkingMode();
    await syncService.enqueue(
      makeAction('WORKING_MODE_EXITED', {
        planId: workingMode.plan.id,
        elapsedSeconds: getElapsedSeconds(workingMode)
      })
    );
  }
};
