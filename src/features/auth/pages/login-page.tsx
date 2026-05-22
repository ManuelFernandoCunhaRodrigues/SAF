import { LoginForm } from "../components/login-form";

export function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-4">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SAF</h1>
          <p className="text-zinc-400 text-sm mt-1">
            Sistema de Administração e Finanças
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 shadow-lg">
          <div className="p-6 pb-0">
            <h2 className="text-xl font-semibold text-zinc-800">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              Faça login para acessar o painel administrativo
            </p>
          </div>
          <div className="p-6">
            <LoginForm />
          </div>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          © {new Date().getFullYear()} SAF. Todos os direitos reservados.
        </p>
      </div>
    </main>
  );
}
