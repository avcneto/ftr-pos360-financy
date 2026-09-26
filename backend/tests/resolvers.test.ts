import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authServiceMocks,
  categoryServiceMocks,
  transactionServiceMocks,
  userServiceMocks,
} = vi.hoisted(() => ({
  authServiceMocks: {
    comparePasswords: vi.fn(),
    generateToken: vi.fn(),
  },
  categoryServiceMocks: {
    createCategory: vi.fn(),
    deleteCategory: vi.fn(),
    listCategoriesByUser: vi.fn(),
    updateCategory: vi.fn(),
  },
  transactionServiceMocks: {
    createTransaction: vi.fn(),
    deleteTransaction: vi.fn(),
    listTransactionsByUser: vi.fn(),
    updateTransaction: vi.fn(),
  },
  userServiceMocks: {
    createUser: vi.fn(),
    findUserByEmail: vi.fn(),
    getUserById: vi.fn(),
  },
}));

vi.mock("../src/services/auth.service", () => authServiceMocks);
vi.mock("../src/services/category.service", () => categoryServiceMocks);
vi.mock("../src/services/transaction.service", () => transactionServiceMocks);
vi.mock("../src/services/user.service", () => userServiceMocks);

import { resolvers } from "../src/resolvers";

describe("resolvers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects anonymous access to protected queries", async () => {
    await expect(
      resolvers.Query.me({}, {}, { user: null } as never),
    ).rejects.toThrow("Unauthorized");
  });

  it("returns the current user and owned data for authenticated queries", async () => {
    userServiceMocks.getUserById.mockResolvedValueOnce({ id: "user-1" });
    categoryServiceMocks.listCategoriesByUser.mockResolvedValueOnce([
      { id: "cat-1" },
    ]);
    transactionServiceMocks.listTransactionsByUser.mockResolvedValueOnce([
      { id: "tx-1" },
    ]);

    await expect(
      resolvers.Query.me({}, {}, { user: { id: "user-1" } } as never),
    ).resolves.toEqual({ id: "user-1" });
    await expect(
      resolvers.Query.categories({}, {}, { user: { id: "user-1" } } as never),
    ).resolves.toEqual([{ id: "cat-1" }]);
    await expect(
      resolvers.Query.transactions({}, {}, { user: { id: "user-1" } } as never),
    ).resolves.toEqual([{ id: "tx-1" }]);
  });

  it("handles sign up and sign in flows", async () => {
    const user = { id: "user-1", email: "ada@example.com" };

    userServiceMocks.findUserByEmail.mockResolvedValueOnce(null);
    userServiceMocks.createUser.mockResolvedValueOnce(user);
    authServiceMocks.generateToken.mockReturnValueOnce("token-1");

    await expect(
      resolvers.Mutation.signUp(
        {},
        { name: "Ada", email: "ada@example.com", password: "secret" },
      ),
    ).resolves.toEqual({ token: "token-1", user });

    userServiceMocks.findUserByEmail.mockResolvedValueOnce(user);
    authServiceMocks.comparePasswords.mockResolvedValueOnce(true);
    authServiceMocks.generateToken.mockReturnValueOnce("token-1");

    await expect(
      resolvers.Mutation.signIn(
        {},
        { email: "ada@example.com", password: "secret" },
      ),
    ).resolves.toEqual({ token: "token-1", user });

    userServiceMocks.findUserByEmail.mockResolvedValueOnce(user);
    await expect(
      resolvers.Mutation.signUp(
        {},
        { name: "Ada", email: "ada@example.com", password: "secret" },
      ),
    ).rejects.toThrow("User already exists");
  });

  it("rejects invalid sign in credentials", async () => {
    userServiceMocks.findUserByEmail.mockResolvedValueOnce(null);

    await expect(
      resolvers.Mutation.signIn(
        {},
        { email: "ada@example.com", password: "secret" },
      ),
    ).rejects.toThrow("Invalid credentials");

    userServiceMocks.findUserByEmail.mockResolvedValueOnce({
      id: "user-1",
      password: "hash",
    });
    authServiceMocks.comparePasswords.mockResolvedValueOnce(false);

    await expect(
      resolvers.Mutation.signIn(
        {},
        { email: "ada@example.com", password: "secret" },
      ),
    ).rejects.toThrow("Invalid credentials");
  });

  it("forwards category mutations to the service layer", async () => {
    categoryServiceMocks.createCategory.mockResolvedValueOnce({ id: "cat-1" });
    categoryServiceMocks.updateCategory.mockResolvedValueOnce({ id: "cat-1" });
    categoryServiceMocks.deleteCategory.mockResolvedValueOnce(true);

    await expect(
      resolvers.Mutation.createCategory(
        {},
        { title: "Food", description: "Meals", color: "#1f6f43", icon: "🍔" },
        { user: { id: "user-1" } } as never,
      ),
    ).resolves.toEqual({ id: "cat-1" });

    await expect(
      resolvers.Mutation.updateCategory({}, { id: "cat-1", title: "Updated" }, {
        user: { id: "user-1" },
      } as never),
    ).resolves.toEqual({ id: "cat-1" });

    await expect(
      resolvers.Mutation.deleteCategory({}, { id: "cat-1" }, {
        user: { id: "user-1" },
      } as never),
    ).resolves.toBe(true);

    expect(categoryServiceMocks.createCategory).toHaveBeenCalledWith({
      title: "Food",
      description: "Meals",
      color: "#1f6f43",
      icon: "🍔",
      userId: "user-1",
    });
  });

  it("forwards transaction mutations to the service layer", async () => {
    transactionServiceMocks.createTransaction.mockResolvedValueOnce({
      id: "tx-1",
    });
    transactionServiceMocks.updateTransaction.mockResolvedValueOnce({
      id: "tx-1",
    });
    transactionServiceMocks.deleteTransaction.mockResolvedValueOnce(true);

    await expect(
      resolvers.Mutation.createTransaction(
        {},
        {
          title: "Salary",
          amount: 2500,
          type: "INCOME",
          date: "2025-01-01",
          description: "Monthly",
          categoryId: "cat-1",
        },
        { user: { id: "user-1" } } as never,
      ),
    ).resolves.toEqual({ id: "tx-1" });

    await expect(
      resolvers.Mutation.updateTransaction(
        {},
        {
          id: "tx-1",
          title: "Updated",
          amount: 120,
          type: "EXPENSE",
          date: "2025-01-02",
          description: "Updated",
          categoryId: "cat-2",
        },
        { user: { id: "user-1" } } as never,
      ),
    ).resolves.toEqual({ id: "tx-1" });

    await expect(
      resolvers.Mutation.deleteTransaction({}, { id: "tx-1" }, {
        user: { id: "user-1" },
      } as never),
    ).resolves.toBe(true);

    expect(transactionServiceMocks.createTransaction).toHaveBeenCalledWith({
      title: "Salary",
      amount: 2500,
      type: "INCOME",
      date: new Date("2025-01-01"),
      description: "Monthly",
      categoryId: "cat-1",
      userId: "user-1",
    });
  });
});
