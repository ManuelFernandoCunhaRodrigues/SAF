export type ClientStatus = "active" | "inactive";

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateClientData = {
  name: string;
  email: string;
  phone: string;
  document: string;
  status?: ClientStatus;
};

export type UpdateClientData = Partial<CreateClientData>;
