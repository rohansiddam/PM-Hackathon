import { STANDARD_ERROR_MESSAGES } from '../constants/errors';

export class StandardApiError extends Error {
  constructor(
    public code: keyof typeof STANDARD_ERROR_MESSAGES,
    public source: string
  ) {
    super(STANDARD_ERROR_MESSAGES[code]);
    this.name = 'StandardApiError';
  }
}

export const normalizeApiError = (source: string, raw: unknown): StandardApiError => {
  if (raw instanceof StandardApiError) {
    return raw;
  }

  if (raw instanceof Error && /401|403/.test(raw.message)) {
    return new StandardApiError('unauthorized', source);
  }

  if (raw instanceof Error && /timeout/i.test(raw.message)) {
    return new StandardApiError('timeout', source);
  }

  if (raw instanceof Error && /permission|denied|not authorized/i.test(raw.message)) {
    return new StandardApiError('permission', source);
  }

  if (raw instanceof Error && /network|offline|fetch/i.test(raw.message)) {
    return new StandardApiError('network', source);
  }

  return new StandardApiError('unknown', source);
};
