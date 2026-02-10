import { normalizeApiError } from '../../lib/apiError';
import { HubId, HubMember } from '../../types/domain';

const mockMembersByHub: Record<HubId, HubMember[]> = {
  WEB: [
    { id: 'u1', initials: 'AN', majorTrack: 'Engineering', lastActiveAt: new Date().toISOString() },
    { id: 'u2', initials: 'RK', majorTrack: 'Engineering', lastActiveAt: new Date().toISOString() },
    { id: 'u3', initials: 'JP', majorTrack: 'Engineering', lastActiveAt: new Date().toISOString() }
  ],
  LNCO: [
    { id: 'u4', initials: 'LM', majorTrack: 'Humanities', lastActiveAt: new Date().toISOString() },
    { id: 'u5', initials: 'DS', majorTrack: 'Humanities', lastActiveAt: new Date().toISOString() },
    { id: 'u6', initials: 'CF', majorTrack: 'Humanities', lastActiveAt: new Date().toISOString() }
  ]
};

export async function fetchSilentCoworkers(hubId: HubId): Promise<HubMember[]> {
  try {
    return mockMembersByHub[hubId].map((member) => ({
      ...member,
      lastActiveAt: new Date().toISOString()
    }));
  } catch (error) {
    throw normalizeApiError('FIREBASE', error);
  }
}
