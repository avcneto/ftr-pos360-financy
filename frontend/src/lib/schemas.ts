import { z } from "zod";

const passwordSchema = z.string().min(8, "A senha deve ter no mínimo 8 caracteres");

export const signInSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Informe um nome com pelo menos 2 caracteres"),
  email: z.email("Informe um e-mail válido"),
  password: passwordSchema,
});

export const categorySchema = z.object({
  title: z.string().min(2, "Informe um título com pelo menos 2 caracteres."),
  description: z.string().optional(),
  color: z.string().default("#16a34a"),
  icon: z.string().default("✦"),
});

export const transactionSchema = z.object({
  title: z.string().min(2, "Informe uma descrição com pelo menos 2 caracteres."),
  amount: z.coerce.number().positive("O valor deve ser maior que zero."),
  type: z.enum(["EXPENSE", "INCOME"]),
  date: z.string().min(1, "Informe a data."),
  description: z.string().optional(),
  categoryId: z.string().nullable().optional(),
});
