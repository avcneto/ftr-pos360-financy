import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/AuthProvider";
import { Button } from "../ui/Button";

const NAV_LINK_BASE =
  "rounded-md px-3 py-2 text-sm font-medium text-[#374151] transition hover:bg-[#f3f4f6] hover:text-[#111827]";

function getLinkClassName(isActive: boolean) {
  return `${NAV_LINK_BASE} ${isActive ? "bg-[#f3f4f6] text-[#111827]" : ""}`;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_-20%,#dff5e8_0%,transparent_55%),radial-gradient(circle_at_100%_0%,#e8f0ff_0%,transparent_40%),#f8f9fa] text-[#374151]">
      <header className="h-[69px] border-b border-[#e5e7eb] bg-white/88 px-12 py-4 backdrop-blur-[10px] max-[980px]:h-auto max-[980px]:px-4">
        <div className="mx-auto flex max-w-[1184px] items-center justify-between gap-6 max-[980px]:flex-wrap max-[980px]:justify-center">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-[8px] bg-gradient-to-br from-[#1f6f43] to-[#124b2b] font-semibold text-white">
              F
            </div>
            <div>
              <p className="m-0 text-[11px] uppercase tracking-[0.1em] text-[#9ca3af]">
                Finance
              </p>
              <h2 className="m-0 text-[1.15rem] font-semibold leading-none text-[#111827]">
                Financy
              </h2>
            </div>
          </div>

          <nav
            className="flex items-center gap-1 max-[980px]:w-full max-[980px]:flex-wrap max-[980px]:justify-center"
            aria-label="Main navigation"
          >
            <NavLink to="/" end className={({ isActive }) => getLinkClassName(isActive)}>
              Dashboard
            </NavLink>
            <NavLink to="/transactions" className={({ isActive }) => getLinkClassName(isActive)}>
              Transactions
            </NavLink>
            <NavLink to="/categories" className={({ isActive }) => getLinkClassName(isActive)}>
              Categories
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => getLinkClassName(isActive)}>
              Profile
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 max-[980px]:w-full max-[980px]:justify-between">
            <div className="flex flex-col gap-[2px]">
              <strong className="text-[13px] text-[#111827]">
                {user?.name ?? "User"}
              </strong>
              <span className="text-[12px] text-[#6b7280]">
                {user?.email ?? "No email"}
              </span>
            </div>
            <Button variant="danger" type="button" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="px-12 py-12 max-[980px]:px-4 max-[980px]:py-6">
        <div className="mx-auto max-w-[1184px]">{children}</div>
      </main>
    </div>
  );
}
