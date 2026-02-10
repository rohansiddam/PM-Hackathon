import { storage } from '../lib/storage';
import { TransitTrip, SyncAction } from '../types/domain';
import { getFallbackTravelMinutes } from './api/googleMapsClient';
import { getTransitSuggestion } from './api/utaClient';
import { syncService } from './syncService';

const makeAction = (type: SyncAction['type'], payload: Record<string, unknown>): SyncAction => ({
  id: `action-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  type,
  payload,
  createdAt: new Date().toISOString()
});

const offlineFallbackTrip = async (): Promise<TransitTrip> => {
  const minutes = await getFallbackTravelMinutes();
  return {
    routeName: 'Offline fallback route',
    departureTime: 'ASAP',
    arrivalTime: `~${minutes} min`,
    confidence: 'LOW',
    disruptions: ['Realtime agency feed unavailable. Using cached estimate.']
  };
};

export const transitService = {
  getPlan: async (): Promise<TransitTrip> => {
    const cached = await storage.getTrip();
    return cached ?? offlineFallbackTrip();
  },

  refreshPlan: async (): Promise<TransitTrip> => {
    const trip = await getTransitSuggestion();
    await storage.setTrip(trip);
    await syncService.enqueue(makeAction('TRANSIT_REFRESHED', { routeName: trip.routeName }));
    return trip;
  }
};
