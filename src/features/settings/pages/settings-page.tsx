import { useState } from "react";
import {
  User, Mail, Shield, Lock, Eye, EyeOff,
  Save, KeyRound, Info, CheckCircle,
} from "lucide-react";
import { useAuthContext } from "@/app/providers/use-auth";

/* ─── sub-componente: campo de formulário ─── */
function FormField({
  id, label, type = "text", defaultValue, placeholder, hint, rightSlot,
}: {
  id: string; label: string; type?: string;
  defaultValue?: string; placeholder?: string; hint?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full h-11 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-3 flex items-center">{rightSlot}</div>
        )}
      </div>
      {hint && <p className="text-xs text-zinc-400 dark:text-zinc-500">{hint}</p>}
    </div>
  );
}

/* ─── sub-componente: campo senha com toggle ─── */
function PasswordField({ id, label, placeholder }: { id: string; label: string; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <FormField
      id={id}
      label={label}
      type={show ? "text" : "password"}
      placeholder={placeholder ?? "••••••••"}
      rightSlot={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
    />
  );
}

/* ─── sub-componente: título de seção ─── */
function SectionTitle({ Icon, title, subtitle }: { Icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={17} className="text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="text-base font-bold text-zinc-800 dark:text-zinc-100">{title}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

const C = "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm";

/* ─── página principal ─── */
export function SettingsPage() {
  const { user } = useAuthContext();
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const initial = user?.name?.charAt(0).toUpperCase() ?? "U";
  const role    = user?.role === "admin" ? "Administrador" : "Usuário";

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handlePasswordSave() {
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  }

  return (
    <div className="py-8 max-w-3xl space-y-6">

      {/* ── Cabeçalho ── */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">Configurações</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Gerencie as configurações da sua conta</p>
      </div>

      {/* ── Card Perfil ── */}
      <div className={C}>
        <SectionTitle Icon={User} title="Perfil" subtitle="Atualize suas informações pessoais" />

        {/* Avatar + dados */}
        <div className="flex items-center gap-5 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl font-bold text-white shadow-md flex-shrink-0">
            {initial}
          </div>
          <div>
            <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 leading-tight">
              {user?.name ?? "Usuário"}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail size={12} className="text-zinc-400 dark:text-zinc-500" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{user?.email ?? "—"}</p>
            </div>
            <span className="inline-block mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
              {role}
            </span>
          </div>
        </div>

        {/* Formulário */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          <FormField
            id="name"
            label="Nome completo"
            defaultValue={user?.name}
            placeholder="Seu nome"
            hint="Este nome será exibido na plataforma."
          />
          <FormField
            id="email"
            label="E-mail"
            type="email"
            defaultValue={user?.email}
            placeholder="seu@email.com"
            hint="Use um e-mail válido e acessível."
          />
        </div>

        {/* Botão */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200"
          >
            {saved ? <CheckCircle size={15} /> : <Save size={15} />}
            {saved ? "Salvo!" : "Salvar alterações"}
          </button>
          {saved && (
            <p className="text-xs text-[#60A5FA] font-medium">
              Alterações salvas com sucesso.
            </p>
          )}
        </div>
      </div>

      {/* ── Card Segurança ── */}
      <div className={C}>
        <SectionTitle Icon={Shield} title="Segurança" subtitle="Altere sua senha de acesso" />

        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-5 flex items-center gap-1.5">
          <Lock size={11} /> Use uma senha forte com letras, números e símbolos para proteger sua conta.
        </p>

        <div className="space-y-5">
          <PasswordField id="current-password" label="Senha atual" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <PasswordField id="new-password"     label="Nova senha"           placeholder="Mínimo 8 caracteres" />
            <PasswordField id="confirm-password" label="Confirmar nova senha" placeholder="Repita a nova senha" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handlePasswordSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-900 dark:hover:bg-zinc-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all duration-200"
          >
            {passwordSaved ? <CheckCircle size={15} /> : <KeyRound size={15} />}
            {passwordSaved ? "Atualizado!" : "Atualizar senha"}
          </button>
          {passwordSaved && (
            <p className="text-xs text-[#60A5FA] font-medium">
              Senha atualizada com sucesso.
            </p>
          )}
        </div>
      </div>

      {/* ── Card Sobre o sistema ── */}
      <div className={C}>
        <SectionTitle Icon={Info} title="Sobre o Sistema" subtitle="Informações da instalação" />

        <dl className="space-y-0">
          {[
            { label: "Sistema",   value: "SAF — Sistema de Administração e Finanças" },
            { label: "Versão",    value: "1.0.0" },
            { label: "Ambiente",  value: "development" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-3.5 border-b border-zinc-100 dark:border-zinc-800 last:border-none"
            >
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{item.label}</span>
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{item.value}</span>
            </div>
          ))}
        </dl>
      </div>

    </div>
  );
}
