import * as Location from 'expo-location';
import { MAJOR_HUBS } from '../constants/hubs';
import { normalizeApiError, StandardApiError } from '../lib/apiError';
import { HubBuilding } from '../types/domain';

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const distanceMeters = (aLat: number, aLon: number, bLat: number, bLon: number): number => {
  const earthRadius = 6371000;
  const dLat = toRadians(bLat - aLat);
  const dLon = toRadians(bLon - aLon);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(aLat)) * Math.cos(toRadians(bLat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * earthRadius * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

export const geolocationHubService = {
  detectCurrentHub: async (): Promise<HubBuilding | undefined> => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        throw new StandardApiError('permission', 'LOCATION');
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      const nearby = MAJOR_HUBS
        .map((hub) => {
          const meters = distanceMeters(position.coords.latitude, position.coords.longitude, hub.latitude, hub.longitude);
          return { hub, meters };
        })
        .filter(({ hub, meters }) => meters <= hub.radiusMeters)
        .sort((a, b) => a.meters - b.meters);

      return nearby[0]?.hub;
    } catch (error) {
      if (error instanceof StandardApiError) {
        throw error;
      }

      throw normalizeApiError('LOCATION', error);
    }
  }
};
