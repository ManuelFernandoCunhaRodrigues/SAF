export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "user";
};
