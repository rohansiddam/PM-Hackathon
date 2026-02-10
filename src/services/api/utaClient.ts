import { normalizeApiError } from '../../lib/apiError';
import { TransitTrip } from '../../types/domain';

export async function getTransitSuggestion(): Promise<TransitTrip> {
  try {
    return {
      routeName: 'Route 220 + TRAX Red',
      departureTime: '7:42 AM',
      arrivalTime: '8:17 AM',
      confidence: 'HIGH',
      disruptions: []
    };
  } catch (error) {
    throw normalizeApiError('UTA', error);
  }
}
