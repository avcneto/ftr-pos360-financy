import { describe, expect, it } from "vitest";
import { print } from "graphql";

import { typeDefs } from "../src/schema";

describe("schema", () => {
  it("exports the expected GraphQL document", () => {
    const document = print(typeDefs);

    expect(document).toContain("type User");
    expect(document).toContain("type Transaction");
    expect(document).toContain("type Query");
    expect(document).toContain("createTransaction");
  });
});