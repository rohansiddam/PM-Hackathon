import { normalizeApiError } from '../../lib/apiError';
import { AcademicTask } from '../../types/domain';

export async function getNextCanvasTask(): Promise<AcademicTask> {
  try {
    return {
      id: 'canvas-1',
      course: 'BIO 1610',
      title: 'Lab Reflection Draft',
      dueAt: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
      steps: [
        { id: 's1', label: 'Open assignment page', done: false, estimatedMinutes: 2 },
        { id: 's2', label: 'Write 3 bullet key points', done: false, estimatedMinutes: 8 },
        { id: 's3', label: 'Convert bullets to one paragraph', done: false, estimatedMinutes: 10 }
      ]
    };
  } catch (error) {
    throw normalizeApiError('CANVAS', error);
  }
}
