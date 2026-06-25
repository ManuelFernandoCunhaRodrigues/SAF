import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "../components/client-form";

export function CreateClientPage() {
  const navigate = useNavigate();

  function goBack() {
    navigate("/painel/clientes");
  }

  return (
    <div className="py-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Voltar para lista de clientes"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
            Novo Cliente
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Preencha os dados para cadastrar um novo cliente no sistema
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <ClientForm onSuccess={goBack} onCancel={goBack} />
      </div>
    </div>
  );
}
