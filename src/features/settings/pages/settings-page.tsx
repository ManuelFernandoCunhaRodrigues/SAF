import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";

export function SettingsPage() {
  // Mock user data
  const user = {
    name: "Vinicius Morais",
    email: "vinicius123morais@gmail.com",
    role: "admin",
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-zinc-800">Configurações</h2>
        <p className="text-zinc-500 text-sm mt-1">
          Gerencie as configurações da sua conta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <p className="font-medium text-zinc-800">{user?.name}</p>
              <p className="text-sm text-zinc-400">{user?.email}</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                {user?.role === "admin" ? "Administrador" : "Usuário"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
          </div>

          <Button>Salvar alterações</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança</CardTitle>
          <CardDescription>Altere sua senha de acesso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="current-password">Senha atual</Label>
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-password">Nova senha</Label>
              <Input id="new-password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button>Alterar senha</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
          <CardDescription>Informações da instalação</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2 text-sm">
            {[
              { label: "Sistema", value: "SAF — Sistema de Administração e Finanças" },
              { label: "Versão", value: "1.0.0" },
              { label: "Ambiente", value: "development" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-1.5 border-b last:border-0">
                <span className="text-zinc-500">{item.label}</span>
                <span className="font-medium text-zinc-700">{item.value}</span>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
