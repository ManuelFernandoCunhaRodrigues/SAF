import type { ClientStatus } from "../types/client";

const STATUS_CFG: Record<ClientStatus, { label: string; dot: string; bg: string; text: string }> = {
  active: {
    label: "Ativo",
    dot: "bg-[#3B82F6]",
    bg: "bg-blue-50 dark:bg-[#3B82F6]/10",
    text: "text-blue-500 dark:text-[#60A5FA]",
  },
  inactive: {
    label: "Inativo",
    dot: "bg-zinc-400",
    bg: "bg-zinc-100 dark:bg-zinc-800",
    text: "text-zinc-500 dark:text-zinc-400",
  },
};

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
