import { normalizeApiError } from '../../lib/apiError';

export async function getFallbackTravelMinutes(): Promise<number> {
  try {
    return 32;
  } catch (error) {
    throw normalizeApiError('GOOGLE_MAPS', error);
  }
}
