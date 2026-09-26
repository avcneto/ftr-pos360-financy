export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Category = {
  id: string;
  title: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  userId?: string;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  description?: string | null;
  categoryId?: string | null;
  category?: Category | null;
};
