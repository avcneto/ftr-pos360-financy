import { describe, expect, it } from "vitest";

import { queryClient } from "./react-query";

describe("queryClient", () => {
  it("uses the expected default query options", () => {
    expect(queryClient.getDefaultOptions().queries).toMatchObject({
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    });
  });
});