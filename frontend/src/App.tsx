import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AuthPage } from "./components/pages/AuthPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { CategoriesPage } from "./components/pages/CategoriesPage";
import { TransactionsPage } from "./components/pages/TransactionsPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { useAuth } from "./providers/AuthProvider";

function HomeRoute() {
  const { token, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center">Carregando sessão...</div>;
  if (!token) return <AuthPage />;
  return <AppShell><DashboardPage /></AppShell>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<HomeRoute />} />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <AppShell>
                  <TransactionsPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <AppShell>
                  <CategoriesPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ProfilePage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
