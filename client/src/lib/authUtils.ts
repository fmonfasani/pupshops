export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}
export function isUnauthorizedError(error: Error): boolean {
  return error.message.includes('401') || 
         error.message.includes('Not authenticated') || 
         error.message.includes('Unauthorized');
}

export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof Error) {
    return isUnauthorizedError(error);
  }
  return false;
}
