import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { updateUserSchema, type UpdateUserInput } from "../schemas/user-schema";
import { useUpdateUser } from "../hooks/use-update-user";
import type { User } from "../types/user";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type EditUserFormProps = {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
};

export function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const { mutate, isPending, isSuccess, errorMessage } = useUpdateUser(user.id);

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });

  function onSubmit(data: UpdateUserInput) {
    mutate(data, {
      onSuccess: () => setTimeout(onSuccess, 1200),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

        {/* Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Nome
              </FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* E-mail */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                E-mail
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="usuario@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Perfil + Status */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Perfil
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Status
                </FormLabel>
                <FormControl>
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`w-full h-10 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                      field.value
                        ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400"
                        : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${field.value ? "bg-blue-500" : "bg-zinc-400"}`}
                    />
                    {field.value ? "Ativo" : "Inativo"}
                  </button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Sucesso */}
        {isSuccess && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20">
            <CheckCircle2 size={15} className="text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-400">
              Usuário atualizado com sucesso.
            </p>
          </div>
        )}

        {/* Erro global */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-50 dark:bg-[#EF4444]/10 border border-red-100 dark:border-[#EF4444]/20">
            <AlertCircle size={15} className="text-red-500 dark:text-[#EF4444] flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-[#EF4444]">{errorMessage}</p>
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending || isSuccess}
            className="rounded-xl"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending || isSuccess}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </div>

      </form>
    </Form>
  );
}
