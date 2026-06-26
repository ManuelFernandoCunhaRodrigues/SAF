import { Navigate } from "react-router";
import { useAuthContext } from "@/app/providers/use-auth";

type AdminRouteProps = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/painel/dashboard" replace />;
  }

  return <>{children}</>;
}
