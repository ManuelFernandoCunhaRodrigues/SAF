import { Loader2 } from "lucide-react";

type LoadingProps = {
  text?: string;
};

export function Loading({ text = "Carregando..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-2 p-8">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
      <span className="text-muted-foreground text-sm">{text}</span>
    </div>
  );
}
