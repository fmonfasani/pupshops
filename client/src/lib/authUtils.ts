// client/src/lib/authUtils.ts
function getStatus(error: unknown): number | undefined {
  const e = error as any;
  if (e?.response?.status && typeof e.response.status === 'number') return e.response.status; // axios
  if (typeof e?.status === 'number') return e.status; // fetch/otros
  return undefined;
}

export function isUnauthorizedError(error: unknown): boolean {
  return getStatus(error) === 401;
}

export function isForbiddenError(error: unknown): boolean {
  return getStatus(error) === 403;
}

export function isAuthenticationError(error: unknown): boolean {
  const s = getStatus(error);
  return s === 401 || s === 403;
}

export function errorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  const e = error as any;
  return e?.response?.data?.message ?? e?.message ?? 'Unexpected error';
}
