import { createContext } from "react";
import type { User } from "../types";

export type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
