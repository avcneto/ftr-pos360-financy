import "dotenv/config";
import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { buildContext } from "./context";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

const schema = makeExecutableSchema({ typeDefs, resolvers });
const corsOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  context: buildContext,
  cors: {
    origin: corsOrigins,
    credentials: true,
  },
});

const server = createServer((req, res) => {
  void yoga(req, res);
});

const port = Number(process.env.PORT ?? 4000);

server.listen(port, () => {
  console.log(`GraphQL server running on http://localhost:${port}/graphql`);
});
