import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export function UsersPage() {
  // Mock data
  const users = [
    { id: "1", name: "João Silva", email: "joao@example.com", role: "Admin" },
    { id: "2", name: "Maria Santos", email: "maria@example.com", role: "User" },
    { id: "3", name: "Pedro Oliveira", email: "pedro@example.com", role: "User" },
  ];

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

      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg border border-zinc-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-zinc-900">{user.name}</h3>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
