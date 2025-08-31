import { useEffect } from "react";
import { useAuth } from "..//hooks/useAuth";
import { useToast } from "..//hooks/use-toast";
import Layout from "..//components/Layout";
import Landing from "./Landing";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please log in",
        description: "Redirecting to login...",
        variant: "default",
      });
      // Only redirect once, don't create a loop
      window.location.href = "/api/login";
    }
  }, [isLoading, toast]); // Remove isAuthenticated from dependencies to prevent loop

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Layout>
      <Landing />
    </Layout>
  );
}
