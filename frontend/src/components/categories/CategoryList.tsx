import type { Category } from "../../types";
import { Button } from "../ui/Button";
import { Surface } from "../ui/Surface";

type CategoryListProps = {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  deleteDisabled?: boolean;
};

export function CategoryList({
  categories,
  isLoading,
  onEdit,
  onDelete,
  deleteDisabled = false,
}: CategoryListProps) {
  return (
    <Surface className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="m-0 text-[#111827]">Saved categories</h2>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {isLoading ? (
          <li className="text-[#6b7280]">Loading categories...</li>
        ) : categories.length === 0 ? (
          <li className="text-[#6b7280]">No categories yet.</li>
        ) : (
          categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 rounded-[8px] border border-[#e5e7eb] p-[14px]"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-[38px] w-[38px] place-items-center rounded-[8px] font-bold text-white"
                  style={{ backgroundColor: category.color || "#1f6f43" }}
                >
                  {category.icon || "•"}
                </span>
                <div>
                  <strong>{category.title}</strong>
                  <small className="text-[#6b7280]">
                    {category.description || "No description"}
                  </small>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => onEdit(category)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  disabled={deleteDisabled}
                  onClick={() => onDelete(category.id)}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))
        )}
      </ul>
    </Surface>
  );
}
