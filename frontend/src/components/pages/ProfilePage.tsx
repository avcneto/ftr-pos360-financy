import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/useAuth";
import { Button } from "../ui/Button";
import { PageHeader } from "../ui/PageHeader";
import { Surface } from "../ui/Surface";
import { INPUT_BASE } from "../forms/formStyles";

export function ProfilePage() {
  const { user, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [nameDraft, setNameDraft] = useState(() => ({ source: user?.name ?? "", value: user?.name ?? "" }));
  const currentName = user?.name ?? "";
  const name = nameDraft.source === currentName ? nameDraft.value : currentName;
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) { setMessage("Informe um nome com pelo menos 2 caracteres."); return; }
    try { setSaving(true); setMessage(""); await updateProfile(name.trim()); setMessage("Perfil atualizado com sucesso."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível atualizar o perfil."); }
    finally { setSaving(false); }
  };
  const handleSignOut = () => { signOut(); navigate("/"); };

  return <div className="mx-auto max-w-[448px]"><div className="mb-8"><PageHeader eyebrow="Conta" title="Perfil" description="Gerencie suas informações pessoais" /></div>
    <Surface className="p-6"><div className="flex flex-col items-center gap-2 border-b border-[#e5e7eb] pb-6"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#d1d5db] text-xl font-medium text-[#111827]">{initials}</span><h2 className="mt-2 text-lg font-semibold text-[#111827]">{user?.name ?? "Usuário"}</h2><p className="text-sm text-[#6b7280]">{user?.email ?? "Sem e-mail"}</p></div>
      <form onSubmit={handleSave} className="mt-6 flex flex-col gap-5"><label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">Nome completo<input className={INPUT_BASE} value={name} onChange={(event) => setNameDraft({ source: currentName, value: event.target.value })} autoComplete="name" /></label><label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">E-mail<input aria-label="E-mail" className={`${INPUT_BASE} bg-[#f3f4f6] text-[#6b7280]`} value={user?.email ?? ""} disabled /><span className="text-xs font-normal text-[#6b7280]">O e-mail não pode ser alterado</span></label>{message && <p role="status" className={`text-sm ${message.includes("sucesso") ? "text-[#15803d]" : "text-[#b91c1c]"}`}>{message}</p>}<Button type="submit" disabled={saving} className="h-12 w-full">{saving ? "Salvando..." : "Salvar alterações"}</Button><Button type="button" variant="ghost" className="h-12 w-full" onClick={handleSignOut}><img src="/Icon/log-out.svg" alt="" className="h-4 w-4" />Sair da conta</Button></form>
    </Surface>
  </div>;
}
