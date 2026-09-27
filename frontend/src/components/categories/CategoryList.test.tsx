import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CategoryList } from "./CategoryList";

describe("CategoryList", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders category rows and actions", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const { getByText, getByRole } = render(
      <CategoryList
        categories={[
          {
            id: "cat-1",
            title: "Food",
            description: "Meals",
            color: "#1f6f43",
            icon: "🍔",
          },
        ]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(getByRole("heading", { name: "Food" })).not.toBeNull();
    expect(getByText("Meals")).not.toBeNull();

    fireEvent.click(getByRole("button", { name: "Editar Food" }));
    fireEvent.click(getByRole("button", { name: "Excluir Food" }));

    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "cat-1", title: "Food" }),
    );
    expect(onDelete).toHaveBeenCalledWith("cat-1");
  });

  it("renders loading and empty states", () => {
    const { getByText, rerender } = render(
      <CategoryList
        categories={[]}
        isLoading={true}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(getByText("Carregando categorias...")).not.toBeNull();

    rerender(
      <CategoryList
        categories={[]}
        isLoading={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(getByText("Nenhuma categoria cadastrada.")).not.toBeNull();
  });

  it("uses fallback visuals when fields are missing", () => {
    const { getByText, getByRole } = render(
      <CategoryList
        categories={[
          {
            id: "cat-1",
            title: "General",
            description: null,
            color: null,
            icon: null,
          },
        ]}
        isLoading={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deleteDisabled={true}
      />,
    );

    expect(getByText("Sem descrição")).not.toBeNull();
    expect(getByRole("heading", { name: "General" })).not.toBeNull();
  });
});
