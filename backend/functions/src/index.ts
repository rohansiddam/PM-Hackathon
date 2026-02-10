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

type HubPresenceMember = {
  userId: string;
  initials: string;
  majorTrack: string;
  isStudying: boolean;
  updatedAt: string;
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

export const upsertHubPresence = onCall(async (request) => {
  const data = request.data as Partial<HubPresenceMember> & { hubId?: string };

  if (!data.hubId || !data.userId || !data.initials || !data.majorTrack) {
    throw new Error('INVALID_HUB_PRESENCE_PAYLOAD');
  }

  const ref = db
    .collection('majorHubs')
    .doc(data.hubId)
    .collection('presence')
    .doc(data.userId);

  await ref.set(
    {
      userId: data.userId,
      initials: data.initials,
      majorTrack: data.majorTrack,
      isStudying: data.isStudying !== false,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  return {
    ok: true,
    hubId: data.hubId,
    userId: data.userId
  };
});

export const getHubPresence = onCall(async (request) => {
  const hubId = request.data?.hubId as string | undefined;

  if (!hubId) {
    throw new Error('MISSING_HUB_ID');
  }

  const snapshot = await db
    .collection('majorHubs')
    .doc(hubId)
    .collection('presence')
    .where('isStudying', '==', true)
    .limit(40)
    .get();

  const members = snapshot.docs.map((doc) => doc.data());

  return {
    hubId,
    members,
    updatedAt: new Date().toISOString()
  };
});
