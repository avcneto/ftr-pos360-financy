import { GraphQLContext } from "./context";
import { GraphQLError } from "graphql";
import { comparePasswords, generateToken } from "./services/auth.service";
import {
  createCategory,
  deleteCategory,
  listCategoriesByUser,
  updateCategory,
} from "./services/category.service";
import {
  createTransaction,
  deleteTransaction,
  listTransactionsByUser,
  updateTransaction,
} from "./services/transaction.service";
import {
  createUser,
  findUserByEmail,
  getUserById,
  updateUserName,
} from "./services/user.service";

const ensureAuth = (context: GraphQLContext) => {
  if (!context.user) {
    throw new Error("Unauthorized");
  }
};

export const resolvers = {
  Query: {
    me: async (_root: unknown, _args: unknown, context: GraphQLContext) => {
      ensureAuth(context);
      return getUserById(context.user!.id);
    },

    categories: async (
      _root: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      ensureAuth(context);
      return listCategoriesByUser(context.user!.id);
    },

    transactions: async (
      _root: unknown,
      _args: unknown,
      context: GraphQLContext,
    ) => {
      ensureAuth(context);
      return listTransactionsByUser(context.user!.id);
    },
  },

  Mutation: {
    updateProfile: async (_root: unknown, args: { name: string }, context: GraphQLContext) => {
      ensureAuth(context);
      return updateUserName(context.user!.id, args.name);
    },
    signUp: async (
      _root: unknown,
      args: { name: string; email: string; password: string },
    ) => {
      if (args.name.trim().length < 2) throw new Error("Name must contain at least 2 characters");
      if (args.password.length < 8) throw new Error("Password must contain at least 8 characters");
      const existingUser = await findUserByEmail(args.email);

      if (existingUser) {
        throw new GraphQLError("Este e-mail já está cadastrado.", {
          extensions: { code: "EMAIL_ALREADY_EXISTS" },
        });
      }

      const user = await createUser(args);

      return {
        token: generateToken(user.id),
        user,
      };
    },

    signIn: async (
      _root: unknown,
      args: { email: string; password: string },
    ) => {
      const user = await findUserByEmail(args.email);

      if (!user) {
        throw new GraphQLError("E-mail ou senha incorretos.", {
          extensions: { code: "INVALID_CREDENTIALS" },
        });
      }

      const isValidPassword = await comparePasswords(
        args.password,
        user.password,
      );

      if (!isValidPassword) {
        throw new GraphQLError("E-mail ou senha incorretos.", {
          extensions: { code: "INVALID_CREDENTIALS" },
        });
      }

      return {
        token: generateToken(user.id),
        user,
      };
    },

    createCategory: async (
      _root: unknown,
      args: {
        title: string;
        description?: string;
        color?: string;
        icon?: string;
      },
      context: GraphQLContext,
    ) => {
      ensureAuth(context);

      return createCategory({
        title: args.title,
        description: args.description,
        color: args.color,
        icon: args.icon,
        userId: context.user!.id,
      });
    },

    updateCategory: async (
      _root: unknown,
      args: {
        id: string;
        title?: string;
        description?: string;
        color?: string;
        icon?: string;
      },
      context: GraphQLContext,
    ) => {
      ensureAuth(context);

      return updateCategory(
        args.id,
        {
          title: args.title,
          description: args.description,
          color: args.color,
          icon: args.icon,
        },
        context.user!.id,
      );
    },

    deleteCategory: async (
      _root: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      ensureAuth(context);
      return deleteCategory(args.id, context.user!.id);
    },

    createTransaction: async (
      _root: unknown,
      args: {
        title: string;
        amount: number;
        type: "INCOME" | "EXPENSE";
        date: string;
        description?: string;
        categoryId?: string;
      },
      context: GraphQLContext,
    ) => {
      ensureAuth(context);

      return createTransaction({
        title: args.title,
        amount: args.amount,
        type: args.type,
        date: new Date(args.date),
        description: args.description,
        categoryId: args.categoryId,
        userId: context.user!.id,
      });
    },

    updateTransaction: async (
      _root: unknown,
      args: {
        id: string;
        title?: string;
        amount?: number;
        type?: "INCOME" | "EXPENSE";
        date?: string;
        description?: string;
        categoryId?: string;
      },
      context: GraphQLContext,
    ) => {
      ensureAuth(context);

      return updateTransaction(
        args.id,
        {
          title: args.title,
          amount: args.amount,
          type: args.type,
          date: args.date ? new Date(args.date) : undefined,
          description: args.description,
          categoryId: args.categoryId,
        },
        context.user!.id,
      );
    },

    deleteTransaction: async (
      _root: unknown,
      args: { id: string },
      context: GraphQLContext,
    ) => {
      ensureAuth(context);
      return deleteTransaction(args.id, context.user!.id);
    },
  },
};
