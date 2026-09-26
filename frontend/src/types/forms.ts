export type AuthFormInput = {
  name: string;
  email: string;
  password: string;
};

export type CategoryFormInput = {
  title: string;
  description?: string;
  color: string;
  icon: string;
};

export type TransactionFormInput = {
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  description?: string;
  categoryId?: string | null;
};
