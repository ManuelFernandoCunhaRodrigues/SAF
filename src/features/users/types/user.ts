export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
};

export type UpdateUserData = Partial<Pick<User, "name" | "email" | "role" | "isActive">>;
