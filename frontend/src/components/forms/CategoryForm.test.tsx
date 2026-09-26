import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CategoryForm } from "./CategoryForm";

describe("CategoryForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("resets when the editing category changes", () => {
    const { container, rerender } = render(
      <CategoryForm editingCategory={null} onSave={vi.fn()} />,
    );

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Draft" },
    });

    rerender(
      <CategoryForm
        editingCategory={{
          id: "cat-1",
          title: "Food",
          description: "Meals",
          color: "#123456",
          icon: "🍔",
        }}
        onSave={vi.fn()}
      />,
    );

    expect((container.querySelector('input[name="title"]') as HTMLInputElement).value).toBe(
      "Food",
    );
    expect(
      (container.querySelector('textarea[name="description"]') as HTMLTextAreaElement).value,
    ).toBe("Meals");
    expect((container.querySelector('input[name="icon"]') as HTMLInputElement).value).toBe(
      "🍔",
    );
  });

  it("shows validation errors and submits a valid category", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);

    const { container, getByRole, getByText } = render(
      <CategoryForm editingCategory={null} onSave={onSave} />,
    );

    fireEvent.submit(getByRole("button", { name: "Create category" }).closest("form")!);

    await waitFor(() => {
      expect(getByText("Title is required")).not.toBeNull();
    });

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Food" },
    });
    fireEvent.change(container.querySelector('textarea[name="description"]')!, {
      target: { value: "Meals" },
    });
    fireEvent.change(container.querySelector('input[name="icon"]')!, {
      target: { value: "🍔" },
    });
    fireEvent.submit(getByRole("button", { name: "Create category" }).closest("form")!);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: "Food",
        description: "Meals",
        color: "#1f6f43",
        icon: "🍔",
      });
    });
  });

  it("shows submit failures when saving a category", async () => {
    const onSave = vi.fn().mockRejectedValue(new Error("Could not save category"));

    const { container, getByRole, getByText } = render(
      <CategoryForm editingCategory={null} onSave={onSave} />,
    );

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Food" },
    });
    fireEvent.submit(getByRole("button", { name: "Create category" }).closest("form")!);

    await waitFor(() => {
      expect(getByText("Could not save category")).not.toBeNull();
    });
  });
});
