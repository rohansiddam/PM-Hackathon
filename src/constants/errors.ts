export const STANDARD_ERROR_MESSAGES = {
  network: 'Connection issue detected. We saved your progress and will retry automatically.',
  timeout: 'This is taking longer than expected. Try again when you are ready.',
  unauthorized: 'Session expired. Please sign in again to continue syncing.',
  unknown: 'Something went wrong. Your local data is safe and still available offline.'
} as const;
