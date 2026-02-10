import { onCall } from 'firebase-functions/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

const db = getFirestore();

type SyncAction = {
  id: string;
  userId: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

export const syncActions = onCall(async (request) => {
  const actions = request.data?.actions as SyncAction[] | undefined;

  if (!actions || !Array.isArray(actions)) {
    throw new Error('INVALID_SYNC_PAYLOAD');
  }

  const batch = db.batch();

  for (const action of actions) {
    const ref = db.collection('syncActions').doc(action.id);
    batch.set(ref, action, { merge: true });
  }

  await batch.commit();

  return {
    accepted: actions.length,
    syncedAt: new Date().toISOString()
  };
});
