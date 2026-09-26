import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { AuthForm } from "../forms/AuthForm";

export function AuthPage() {
  const { signIn, signUp, token } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [navigate, token]);

  return (
    <div className="grid min-h-screen place-items-center bg-[#f8f9fa] px-4 py-8">
      <div className="flex w-full flex-col items-center gap-6 pt-2">
        <img src="/Logo.svg" alt="Financy" className="h-8 w-auto" />
        <AuthForm
          isLogin={isLogin}
          onSignIn={signIn}
          onSignUp={signUp}
          onToggleMode={() => setIsLogin((value) => !value)}
        />
      </div>
    </div>
  );
}
