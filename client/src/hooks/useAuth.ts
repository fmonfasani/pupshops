import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { isUnauthorizedError } from "../lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: api.getUser,
    retry: (failureCount, error) => {
      // Don't retry on 401 errors to prevent loops
      if (isUnauthorizedError(error as Error)) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isAuthenticated: !!user && !error,
    isLoading,
    error,
  };
}