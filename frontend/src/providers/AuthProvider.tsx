import {
  createContext,
  useContext,
  useEffect,
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
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY));
  const [rememberSession, setRememberSession] = useState(() => Boolean(localStorage.getItem(STORAGE_KEY)));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!token) {
      setUser(null);
      setLoading(false);
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    if (rememberSession) { localStorage.setItem(STORAGE_KEY, token); sessionStorage.removeItem(STORAGE_KEY); }
    else { sessionStorage.setItem(STORAGE_KEY, token); localStorage.removeItem(STORAGE_KEY); }

    const fetchUser = async () => {
      try {
        const data = await requestGraphQL<{ me: User | null }>(
          `query GetMe { me { id name email createdAt updatedAt } }`,
          {},
          token,
        );
        if (active) {
          if (data.me) setUser(data.me);
          else {
            setToken(null);
            setUser(null);
            localStorage.removeItem(STORAGE_KEY);
            sessionStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        if (active) {
          setToken(null);
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchUser();
    return () => { active = false; };
  }, [token, rememberSession]);

  const signIn = async (email: string, password: string, remember = true) => {
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

    setRememberSession(remember);
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

    setRememberSession(true);
    setToken(data.signUp.token);
    setUser(data.signUp.user);
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (name: string) => {
    if (!token) throw new Error("Sessão expirada");
    const data = await requestGraphQL<{ updateProfile: User }>(
      `mutation UpdateProfile($name: String!) { updateProfile(name: $name) { id name email createdAt updatedAt } }`,
      { name }, token,
    );
    setUser(data.updateProfile);
  };

  const value: AuthContextValue = { token, user, loading, signIn, signUp, signOut, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Contexto de autenticação não encontrado.");
  }

  return context;
}
