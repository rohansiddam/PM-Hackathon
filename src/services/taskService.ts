import { AcademicTask, SyncAction } from '../types/domain';
import { storage } from '../lib/storage';
import { getNextCanvasTask } from './api/canvasClient';
import { syncService } from './syncService';

const makeAction = (type: SyncAction['type'], payload: Record<string, unknown>): SyncAction => ({
  id: `action-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  payload,
  createdAt: new Date().toISOString()
});

export const taskService = {
  createOrFetchPrimaryTask: async (): Promise<AcademicTask> => {
    const existing = await storage.getTask();
    if (existing) {
      return existing;
    }

    const task = await getNextCanvasTask();
    await storage.setTask(task);
    await syncService.enqueue(makeAction('TASK_CREATED', { taskId: task.id }));
    return task;
  },

  markStepDone: async (task: AcademicTask, stepId: string): Promise<AcademicTask> => {
    const updated: AcademicTask = {
      ...task,
      steps: task.steps.map((step) => (step.id === stepId ? { ...step, done: true } : step))
    };

    await storage.setTask(updated);
    await syncService.enqueue(makeAction('TASK_STEP_COMPLETED', { taskId: task.id, stepId }));
    return updated;
  }
};
