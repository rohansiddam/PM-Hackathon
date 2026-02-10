import { storage } from '../lib/storage';
import { HubBuilding, HubMember, SilentCoworkingRoom, SyncAction } from '../types/domain';
import { syncService } from './syncService';
import { fetchSilentCoworkers } from './api/socialHubClient';
import { geolocationHubService } from './geolocationHubService';

const localUser: HubMember = {
  id: 'local-user',
  initials: 'ME',
  majorTrack: 'You',
  isYou: true,
  lastActiveAt: new Date().toISOString()
};

const makeAction = (type: SyncAction['type'], payload: Record<string, unknown>): SyncAction => ({
  id: `action-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  payload,
  createdAt: new Date().toISOString()
});

const includeYou = (members: HubMember[]): HubMember[] => {
  const withoutYou = members.filter((member) => member.id !== localUser.id);
  return [
    {
      ...localUser,
      lastActiveAt: new Date().toISOString()
    },
    ...withoutYou
  ];
};

export const socialHubService = {
  detectHub: async (): Promise<HubBuilding | undefined> => {
    const hub = await geolocationHubService.detectCurrentHub();

    if (hub) {
      await storage.setCurrentHub(hub);
    } else {
      await storage.clearCurrentHub();
      await storage.clearHubRoom();
    }

    await syncService.enqueue(
      makeAction('HUB_DETECTED', {
        hubId: hub?.id ?? 'NONE'
      })
    );

    return hub;
  },

  loadRoomFromCache: () => storage.getHubRoom(),

  refreshRoom: async (hub: HubBuilding): Promise<SilentCoworkingRoom> => {
    const members = includeYou(await fetchSilentCoworkers(hub.id));

    const room: SilentCoworkingRoom = {
      hubId: hub.id,
      hubCode: hub.code,
      hubName: hub.name,
      majorTrack: hub.majorTrack,
      members,
      updatedAt: new Date().toISOString()
    };

    await storage.setHubRoom(room);
    await syncService.enqueue(
      makeAction('HUB_ROOM_REFRESHED', {
        hubId: hub.id,
        members: room.members.length
      })
    );

    return room;
  },

  markRoomViewed: async (hubId: HubBuilding['id']): Promise<void> => {
    await syncService.enqueue(
      makeAction('HUB_ROOM_VIEWED', {
        hubId
      })
    );
  }
};
