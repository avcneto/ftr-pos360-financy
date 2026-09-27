import type { Category } from "../../types";
import { Surface } from "../ui/Surface";

type Props = { categories: Category[]; isLoading: boolean; onEdit: (category: Category) => void; onDelete: (id: string) => void; deleteDisabled?: boolean; transactionCounts?: Record<string, number> };

export function CategoryList({ categories, isLoading, onEdit, onDelete, deleteDisabled = false, transactionCounts = {} }: Props) {
  if (isLoading) return <p className="text-sm text-[#6b7280]">Carregando categorias...</p>;
  if (categories.length === 0) return <Surface className="p-8 text-sm text-[#6b7280]">Nenhuma categoria cadastrada.</Surface>;
  return <section aria-label="Categorias cadastradas" className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-3 max-[800px]:grid-cols-2 max-[500px]:grid-cols-1">{categories.map((category) => <Surface key={category.id} className="flex min-h-[205px] flex-col p-5">
    <div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-lg" style={{ backgroundColor: `${category.color ?? "#1f6f43"}20` }}><img src={`/Icon/${category.icon || "tag"}.svg`} onError={(event) => { event.currentTarget.src = "/Icon/tag.svg"; }} alt="" className="h-6 w-6" /></span><div className="flex gap-1"><button type="button" aria-label={`Editar ${category.title}`} title="Editar" className="rounded-lg p-2 hover:bg-[#f3f4f6]" onClick={() => onEdit(category)}><img src="/Icon/square-pen.svg" alt="" className="h-4 w-4" /></button><button type="button" aria-label={`Excluir ${category.title}`} title="Excluir" disabled={deleteDisabled} className="rounded-lg p-2 hover:bg-[#fee2e2] disabled:opacity-50" onClick={() => onDelete(category.id)}><img src="/Icon/trash.svg" alt="" className="h-4 w-4" /></button></div></div>
    <h2 className="mt-5 text-base font-semibold text-[#111827]">{category.title}</h2><p className="mt-1 min-h-[40px] text-sm text-[#6b7280]">{category.description || "Sem descrição"}</p><div className="mt-auto flex items-center justify-between pt-3"><span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${category.color ?? "#1f6f43"}20`, color: category.color ?? "#1f6f43" }}>{category.title}</span><span className="text-xs text-[#6b7280]">{transactionCounts[category.id] ?? 0} transações</span></div>
  </Surface>)}</section>;
}
