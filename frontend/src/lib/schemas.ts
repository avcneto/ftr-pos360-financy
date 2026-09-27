import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Informe um nome com pelo menos 2 caracteres"),
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export const categorySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  color: z.string().default("#1f6f43"),
  icon: z.string().default("✦"),
});

export const transactionSchema = z.object({
  title: z.string().min(2, "Title is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  type: z.enum(["EXPENSE", "INCOME"]),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
});
