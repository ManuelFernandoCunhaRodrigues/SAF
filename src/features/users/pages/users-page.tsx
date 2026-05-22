import { Plus } from "lucide-react";
import { useUsers } from "../hooks/use-users";
import { UserCard } from "../components/user-card";
import { Button } from "@/shared/components/ui/button";

export function UsersPage() {
  const { data, isLoading, isError } = useUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-800">Usuários</h2>
          <p className="text-zinc-500 text-sm mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Novo Usuário
        </Button>
      </div>

      {isLoading && (
        <p className="text-zinc-400">Carregando usuários...</p>
      )}

      {isError && (
        <p className="text-red-500">Erro ao carregar usuários.</p>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data && data.length > 0 ? (
            data.map((user) => <UserCard key={user.id} user={user} />)
          ) : (
            <p className="text-zinc-400 col-span-full">
              Nenhum usuário encontrado.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
