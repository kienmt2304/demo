import { readFile, readdir, open, type FileHandle } from "fs/promises";
import type { PackageJson } from "type-fest";

type PackageJsonWithCustomMark = PackageJson & {
  pkgDemo?: Record<string, string>;
};

const readJSonFile = async (path: string) => {
  try {
    const data = await readFile(path, "utf8");
    return JSON.parse(data) as PackageJsonWithCustomMark;
  } catch (error) {
    console.error(error);
  }
};

const IMPORT_PLACEHOLDER = "/* import */";
const ROUTE_PLACEHOLDER = "{/* route modules */}";

function toImport(name: string) {
  return `const ${toPascalCase(name)} = lazy(() => import('${name}'));`;
}

const toUnscoped = (name: string) => name.replace(/^@[^/]+\//, "");

function toRoute(name: string) {
  return `<Route path="/${toUnscoped(name)}" element={<${toPascalCase(name)} />} />`;
}

function insertAfter(
  content: string,
  placeholder: string,
  lines: string[],
): string {
  if (lines.length === 0) return content;
  const idx = content.indexOf(placeholder);
  if (idx === -1) throw new Error("Placeholder not found");
  const lineStart = content.lastIndexOf("\n", idx) + 1;
  const indent = content.slice(lineStart, idx).match(/^[ \t]*/)![0];
  const at = idx + placeholder.length;
  const block = lines.map((line) => `\n${indent}${line}`).join("");
  return `${content.slice(0, at)}${block}${content.slice(at)}`;
}

async function readAll(handle: FileHandle): Promise<string> {
  const { size } = await handle.stat();
  const buf = Buffer.alloc(size);
  await handle.read(buf, 0, size, 0);
  const string = buf.toString("utf-8");
  return string;
}

async function insertRouteModules(handle: FileHandle, components: string[]) {
  const content = await readAll(handle);
  const existing = new Set(content.split(/\r?\n/).map((line) => line.trim()));

  const fresh = (lines: string[]) =>
    [...new Set(lines)].filter((line) => !existing.has(line));
  const imports = fresh(components.map(toImport));
  const routes = fresh(components.map(toRoute));
  if (!imports.length && !routes.length) return { imports, routes };

  let updated = insertAfter(content, IMPORT_PLACEHOLDER, imports);
  updated = insertAfter(updated, ROUTE_PLACEHOLDER, routes);

  await handle.truncate(0);
  await handle.write(updated, 0, "utf-8");
  return { imports, routes };
}

const toPascalCase = (str: string) =>
  (str.match(/[a-zA-Z0-9]+/g) || [])
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

async function main() {
  const rootPackage = await readJSonFile("./package.json");
  if (!rootPackage) return;

  const modules = Object.entries(rootPackage.dependencies ?? {}).filter(
    ([, value]) => value?.startsWith("file:"),
  );
  if (!modules.length) return;

  const rootFile = await open("./app/routes/module.tsx", "r+");

  const components = [];

  for (const module of modules) {
    const [name, value] = module;
    if (!name || !value) continue;
    const modulePath = value.replace("file:", "");
    console.log(`Loading module ${name} from ${modulePath}`);
    const files = await readdir(modulePath);
    if (!files.includes("package.json")) continue;
    const modulePackage = await readJSonFile(`${modulePath}/package.json`);
    if (!modulePackage || !modulePackage.pkgDemo) continue;
    components.push(name);
  }

  await insertRouteModules(rootFile, components).then(() =>
    console.log("Done"),
  );
}

main();
