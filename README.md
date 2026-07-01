# SAF — Sistema de Automação Financeira (Frontend)

Interface web do SAF para gestão de clientes, faturas, cobranças e dashboard financeiro.

## Stack

- React 18 + TypeScript
- Vite 8
- TailwindCSS + shadcn/ui
- React Query (TanStack Query) — cache e sincronização de dados
- React Router DOM — roteamento
- Axios — chamadas HTTP com token Bearer automático
- Zod + React Hook Form — validação de formulários
- Recharts — gráficos do dashboard

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org)
- Backend SAF rodando em `http://localhost:3333`

---

## Início rápido

```bash
npm install
cp .env.example .env    # se existir, senão crie conforme abaixo
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

---

## Variável de ambiente

Crie um `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3333
```

Em produção, aponte para a URL da API deployada.

---

## Scripts

```bash
npm run dev      # servidor de desenvolvimento com HMR
npm run build    # build de produção (tsc + vite build)
npm run preview  # preview do build local
npm run lint     # ESLint
```

---

## Estrutura do projeto

```
sistema-saf/
├── src/
│   ├── app/
│   │   ├── config/         # Configurações globais (app-config.ts)
│   │   ├── providers/      # AuthProvider, AppProvider, contextos globais
│   │   └── routes/         # Definição de rotas (app-routes.tsx)
│   ├── features/           # Módulos por domínio
│   │   ├── auth/           # Login, contexto de autenticação, JWT
│   │   │   ├── components/ # LoginForm
│   │   │   ├── hooks/      # useAuth
│   │   │   ├── pages/      # LoginPage
│   │   │   ├── services/   # auth-service.ts
│   │   │   └── types/
│   │   ├── clients/        # CRUD de clientes
│   │   │   ├── components/ # ClientTable, ClientForm, ClientSearch
│   │   │   ├── hooks/      # useClients, useCreateClient, useUpdateClient, useDeleteClient
│   │   │   ├── pages/      # ClientsPage, CreateClientPage, EditClientPage
│   │   │   └── services/   # client-service.ts
│   │   ├── invoices/       # Faturas e geração de Pix
│   │   │   ├── components/
│   │   │   │   ├── InvoiceForm.tsx
│   │   │   │   └── InvoicePixDialog.tsx   # QR Code, copia-e-cola, loading, erro
│   │   │   ├── hooks/
│   │   │   │   ├── useInvoices.ts
│   │   │   │   ├── useCreateInvoice.ts
│   │   │   │   ├── useUpdateInvoice.ts
│   │   │   │   ├── useUpdateInvoiceStatus.ts
│   │   │   │   ├── useDeleteInvoice.ts
│   │   │   │   └── useGenerateInvoicePix.ts   # chamada POST /invoices/:id/pix
│   │   │   ├── pages/      # InvoicesPage
│   │   │   └── services/   # invoice-service.ts
│   │   ├── dashboard/      # Resumo financeiro
│   │   │   ├── components/ # StatsCard, PerformanceChart (Recharts)
│   │   │   ├── hooks/      # useDashboard
│   │   │   ├── pages/      # DashboardPage
│   │   │   └── services/   # dashboard-service.ts
│   │   ├── users/          # Gestão de usuários (admin)
│   │   └── settings/       # Página de configurações
│   ├── overview/           # Páginas públicas (Home, About, Contact, NotFound)
│   └── shared/
│       ├── components/
│       │   ├── common/     # ProtectedRoute, AdminRoute, Loading, EmptyState
│       │   ├── layout/     # Navbar, Sidebar, PainelHeader, MobileBottomNav
│       │   └── ui/         # Button, Card, Dialog, Input, Select, Table, Form…
│       ├── context/        # SidebarContext, ThemeContext
│       ├── hooks/          # useMobile
│       ├── lib/
│       │   ├── http.ts         # Instância Axios com interceptor Bearer
│       │   ├── query-client.ts # Configuração do React Query
│       │   └── utils.ts
│       ├── services/
│       │   └── api.ts          # Configuração base da API
│       └── types/
│           └── global.ts
├── .env                    # Variáveis locais (não commitado)
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── eslint.config.js
```

---

## Fluxo de autenticação

1. Usuário faz login em `/login` — o token JWT é salvo no `localStorage`
2. `AuthProvider` expõe `user` e `token` via contexto
3. `http.ts` injeta `Authorization: Bearer <token>` em todas as requisições Axios automaticamente
4. Rotas protegidas usam `<ProtectedRoute>` — redireciona para `/login` se não autenticado
5. Rotas de admin usam `<AdminRoute>` — verifica `user.role === 'admin'`

---

## Funcionalidades implementadas

### Dashboard
- Cards com totais: clientes ativos, faturas totais, pendentes e vencidas
- Gráfico de linha com evolução de faturas pagas vs. pendentes

### Clientes
- Listagem com busca por nome/documento
- Criação, edição e remoção
- Badge de status (ativo/inativo)

### Faturas
- Listagem com status colorido (pendente, paga, vencida, cancelada)
- Criação vinculada a cliente
- Atualização de status
- Remoção
- Geração de Pix: dialog com QR Code, copia-e-cola e botão de copiar

### Faturas — Pix
O `InvoicePixDialog` chama `POST /api/invoices/:id/pix` e exibe:
- QR Code como imagem (`data:image/png;base64,...`)
- Código copia e cola com botão de copiar e feedback visual
- Estado de loading durante a geração
- Mensagem de erro com botão "Tentar novamente"

---

## Roadmap

- [x] Autenticação JWT com proteção de rotas
- [x] CRUD de clientes
- [x] CRUD de faturas com gestão de status
- [x] Dashboard com dados reais da API
- [x] Geração de Pix (QR Code + copia e cola)
- [ ] Geração de boleto (linha digitável + PDF)
- [ ] Atualização automática de status via webhook
- [ ] Notificações em tempo real (WebSocket ou polling)
- [ ] Envio de cobranças via WhatsApp
