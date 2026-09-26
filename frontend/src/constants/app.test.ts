import { describe, expect, it } from "vitest";

import { STORAGE_KEY } from "./app";

describe("app constants", () => {
  it("exposes the token storage key", () => {
    expect(STORAGE_KEY).toBe("financy-token");
  });
});