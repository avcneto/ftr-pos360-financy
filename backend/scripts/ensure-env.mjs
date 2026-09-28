import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(new URL("../.env", import.meta.url));
const examplePath = fileURLToPath(new URL("../.env.example", import.meta.url));

if (existsSync(envPath)) {
  console.log("Arquivo .env existente preservado.");
} else {
  const example = readFileSync(examplePath, "utf8");
  if (!/^JWT_SECRET=[^\r\n]*$/m.test(example)) {
    throw new Error("JWT_SECRET não foi encontrado em .env.example.");
  }

  const secret = randomBytes(32).toString("hex");
  const contents = example.replace(/^JWT_SECRET=[^\r\n]*$/m, `JWT_SECRET=${secret}`);

  try {
    writeFileSync(envPath, contents, { flag: "wx", mode: 0o600 });
    console.log("Arquivo .env criado com JWT_SECRET aleatório.");
  } catch (error) {
    if (error?.code !== "EEXIST") throw error;
    console.log("Arquivo .env existente preservado.");
  }
}
