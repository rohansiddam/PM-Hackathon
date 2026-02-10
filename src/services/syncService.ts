import { storage } from '../lib/storage';
import { SyncAction } from '../types/domain';

async function pushToFirebase(_action: SyncAction): Promise<void> {
  return;
}

export const syncService = {
  enqueue: async (action: SyncAction): Promise<number> => {
    const queue = await storage.getQueue();
    const updated = [...queue, action];
    await storage.setQueue(updated);
    return updated.length;
  },

  flush: async (online: boolean): Promise<{ pending: number; lastSyncedAt?: string }> => {
    const queue = await storage.getQueue();

    if (!online || queue.length === 0) {
      return {
        pending: queue.length,
        lastSyncedAt: await storage.getLastSyncedAt() ?? undefined
      };
    }

    for (const action of queue) {
      await pushToFirebase(action);
    }

    await storage.setQueue([]);
    const now = new Date().toISOString();
    await storage.setLastSyncedAt(now);

    return { pending: 0, lastSyncedAt: now };
  }
};
