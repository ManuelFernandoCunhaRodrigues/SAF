import { useParams, useNavigate } from "react-router";
import { ArrowLeft, AlertTriangle, Loader2 } from "lucide-react";
import { useClient } from "../hooks/use-client";
import { EditClientForm } from "../components/edit-client-form";

export function EditClientPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: client, isLoading, isError } = useClient(id);

  function goBack() {
    navigate("/painel/clientes");
  }

  return (
    <div className="py-8 max-w-2xl mx-auto space-y-6">

      {/* Cabeçalho */}
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
            {isLoading ? "Carregando..." : client ? `Editar: ${client.name}` : "Editar Cliente"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Atualize os dados do cliente
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">

        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 size={24} className="text-blue-600 animate-spin" />
            <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Carregando dados do cliente...
            </p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-4 py-10">
            <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-[#EF4444]/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500 dark:text-[#EF4444]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#EF4444]">
                Não foi possível carregar os dados do cliente
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                Verifique a conexão com a API ou tente novamente
              </p>
            </div>
            <button
              onClick={goBack}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Voltar para a lista
            </button>
          </div>
        )}

        {client && (
          <EditClientForm
            client={client}
            onSuccess={goBack}
            onCancel={goBack}
          />
        )}

      </div>
    </div>
  );
}
