import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] text-[#374151]">
        Loading your session...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
