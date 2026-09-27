import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";

const NAV_LINK_BASE = "text-sm text-[#4b5563] transition hover:text-[#1f6f43]";

function getLinkClassName(isActive: boolean) {
  return `${NAV_LINK_BASE} ${isActive ? "font-semibold text-[#1f6f43]" : ""}`;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#374151]">
      <header className="border-b border-[#e5e7eb] bg-white px-12 py-4 max-[700px]:px-4">
        <div className="relative mx-auto flex max-w-[1280px] items-center justify-between gap-6 max-[700px]:flex-wrap">
          <NavLink to="/" aria-label="Financy - Dashboard"><img src="/Logo.svg" alt="Financy" className="h-6 w-[100px]" /></NavLink>

          <nav
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-5 max-[700px]:static max-[700px]:order-3 max-[700px]:w-full max-[700px]:translate-x-0 max-[700px]:justify-center"
            aria-label="Main navigation"
          >
            <NavLink
              to="/"
              end
              className={({ isActive }) => getLinkClassName(isActive)}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/transactions"
              className={({ isActive }) => getLinkClassName(isActive)}
            >
              Transações
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) => getLinkClassName(isActive)}
            >
              Categorias
            </NavLink>
          </nav>
          <NavLink to="/profile" aria-label="Perfil" title={user?.name ?? "Perfil"} className="grid h-9 w-9 place-items-center rounded-full bg-[#d1d5db] text-sm font-medium text-[#111827]">{initials}</NavLink>
        </div>
      </header>

      <main className="px-12 py-10 max-[700px]:px-4 max-[700px]:py-6">
        <div className="mx-auto max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
