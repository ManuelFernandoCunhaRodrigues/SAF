import type { User } from "../types/user";

type UserCardProps = {
  user: User;
};

export function UserCard({ user }: UserCardProps) {
  return (
    <article className="rounded-lg border p-4 flex flex-col gap-1">
      <h2 className="font-semibold">{user.name}</h2>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <span
        className={`text-xs font-medium w-fit px-2 py-0.5 rounded-full ${
          user.status === "active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {user.status === "active" ? "Ativo" : "Inativo"}
      </span>
    </article>
  );
}
