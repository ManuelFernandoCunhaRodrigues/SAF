import { Routes, Route, Navigate } from "react-router";

import { LoginPage } from "@/features/auth/pages/login-page";
import { DashboardPage } from "@/features/dashboard/pages/dashboard-page";
import { UsersPage } from "@/features/users/pages/users-page";
import { InvoicesPage } from "@/features/invoices/pages/invoices-page";
import { ClientsPage } from "@/features/clients/pages/clients-page";
import { CreateClientPage } from "@/features/clients/pages/create-client-page";
import { EditClientPage } from "@/features/clients/pages/edit-client-page";
import { SettingsPage } from "@/features/settings/pages/settings-page";
import { NotFoundPage } from "@/overview/not-found/not-found-page";
import { PanelLayoutWithProvider } from "@/shared/components/layout/painel-layout-with-provider";
import { ProtectedRoute } from "@/shared/components/common/protected-route";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/painel"
        element={
          <ProtectedRoute>
            <PanelLayoutWithProvider />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/painel/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="usuarios" element={<UsersPage />} />
        <Route path="faturas" element={<InvoicesPage />} />
        <Route path="clientes" element={<ClientsPage />} />
        <Route path="clientes/novo" element={<CreateClientPage />} />
        <Route path="clientes/:id/editar" element={<EditClientPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/painel/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
