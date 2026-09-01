import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, "server"), { recursive: true });
await mkdir(path.join(output, "client"), { recursive: true });
await cp(path.join(root, "out"), path.join(output, "client"), {
  recursive: true,
});

const worker = `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
`;

await writeFile(path.join(output, "server", "index.js"), worker, "utf8");
