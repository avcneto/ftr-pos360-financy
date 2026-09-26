import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { requestGraphQL } from "../api/graphql";
import { STORAGE_KEY } from "../constants/app";
import type { User } from "../types";

export type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, token);

    const fetchUser = async () => {
      try {
        const data = await requestGraphQL<{ me: User | null }>(
          `query GetMe { me { id name email createdAt updatedAt } }`,
          {},
          token,
        );
        setUser(data.me);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, [token]);

  const signIn = async (email: string, password: string) => {
    const data = await requestGraphQL<{
      signIn: { token: string; user: User };
    }>(
      `mutation SignIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
          token
          user { id name email }
        }
      }`,
      { email, password },
    );

    setToken(data.signIn.token);
    setUser(data.signIn.user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const data = await requestGraphQL<{
      signUp: { token: string; user: User };
    }>(
      `mutation SignUp($name: String!, $email: String!, $password: String!) {
        signUp(name: $name, email: $email, password: $password) {
          token
          user { id name email }
        }
      }`,
      { name, email, password },
    );

    setToken(data.signUp.token);
    setUser(data.signUp.user);
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ token, user, loading, signIn, signUp, signOut }),
    [token, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Auth context not found");
  }

  return context;
}
