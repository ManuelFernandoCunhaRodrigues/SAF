import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";

import { LoginPage } from "@/features/auth/pages/login-page";
import { PanelLayoutWithProvider } from "@/shared/components/layout/painel-layout-with-provider";
import { ProtectedRoute } from "@/shared/components/common/protected-route";
import { AdminRoute } from "@/shared/components/common/admin-route";

const DashboardPage   = React.lazy(() => import("@/features/dashboard/pages/dashboard-page").then(m => ({ default: m.DashboardPage })));
const UsersPage       = React.lazy(() => import("@/features/users/pages/users-page").then(m => ({ default: m.UsersPage })));
const InvoicesPage    = React.lazy(() => import("@/features/invoices/pages/invoices-page").then(m => ({ default: m.InvoicesPage })));
const ClientsPage     = React.lazy(() => import("@/features/clients/pages/clients-page").then(m => ({ default: m.ClientsPage })));
const CreateClientPage = React.lazy(() => import("@/features/clients/pages/create-client-page").then(m => ({ default: m.CreateClientPage })));
const EditClientPage  = React.lazy(() => import("@/features/clients/pages/edit-client-page").then(m => ({ default: m.EditClientPage })));
const SettingsPage    = React.lazy(() => import("@/features/settings/pages/settings-page").then(m => ({ default: m.SettingsPage })));
const NotFoundPage    = React.lazy(() => import("@/overview/not-found/not-found-page").then(m => ({ default: m.NotFoundPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="h-6 w-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
          <Route
            path="usuarios"
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />
          <Route path="faturas" element={<InvoicesPage />} />
          <Route path="clientes" element={<ClientsPage />} />
          <Route path="clientes/novo" element={<CreateClientPage />} />
          <Route path="clientes/:id/editar" element={<EditClientPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/painel/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
