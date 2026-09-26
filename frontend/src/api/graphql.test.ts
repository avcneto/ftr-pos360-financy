import { beforeEach, describe, expect, it, vi } from "vitest";
import { requestGraphQL } from "./graphql";

describe("requestGraphQL", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the query and variables to the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { me: { id: "user-1" } } }),
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(requestGraphQL<{ me: { id: string } }>("query Me { me { id } }", {})).resolves.toEqual({
      me: { id: "user-1" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
