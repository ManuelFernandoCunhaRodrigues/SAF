import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-muted-foreground text-lg">Página não encontrada.</p>
      <Link to="/" className="text-primary underline underline-offset-4">
        Voltar ao início
      </Link>
    </main>
  );
}
