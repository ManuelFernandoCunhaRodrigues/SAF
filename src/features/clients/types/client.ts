export type ClientStatus = "active" | "inactive";
export type ClientType = "individual" | "company";

export type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  document: string | null;
  type: ClientType;
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
