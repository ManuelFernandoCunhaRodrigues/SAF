import { AppRoutes } from "@/app/routes/app-routes";
import { AuthProvider } from "@/app/providers/auth-provider";

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
