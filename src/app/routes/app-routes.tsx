import { Routes, Route, Navigate } from "react-router";

import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { UsersPage } from "@/features/users/pages/users-page";
import { InvoicesPage } from "@/features/invoices/pages/invoices-page";
import { SettingsPage } from "@/features/settings/pages/settings-page";
import { NotFoundPage } from "@/overview/not-found/not-found-page";
import { PanelLayout } from "@/shared/components/layout/panel-layout";
import { ProtectedRoute } from "@/shared/components/common/protected-route";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/painel"
        element={
          <ProtectedRoute>
            <PanelLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/painel/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="faturas" element={<InvoicesPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/painel/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
