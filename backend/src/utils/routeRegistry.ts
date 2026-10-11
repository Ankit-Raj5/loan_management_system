import { Application, Router } from "express";

interface RouteLayer {
  route?: { path: string; methods: Record<string, boolean> };
  handle?: { stack?: RouteLayer[] };
}

const prefixes = new WeakMap<Router, string>();

// Mounts a router under a prefix and remembers the prefix so routes can be listed later
export const mountRouter = (parent: Application | Router, prefix: string, router: Router): void => {
  prefixes.set(router, prefix);
  (parent as Router).use(prefix, router);
};

// Recursively collects "METHOD /full/path" entries from a router's layers
const collect = (stack: RouteLayer[], base: string, out: string[]): void => {
  for (const layer of stack) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase());
      for (const method of methods) out.push(`${method.padEnd(7)} ${base}${layer.route.path}`);
    } else if (layer.handle?.stack) {
      const prefix = prefixes.get(layer.handle as unknown as Router) ?? "";
      collect(layer.handle.stack, `${base}${prefix}`, out);
    }
  }
};

// Prints every registered route in the terminal
export const printRoutes = (app: Application): void => {
  const stack = (app as unknown as { router: { stack: RouteLayer[] } }).router.stack;
  const lines: string[] = [];
  collect(stack, "", lines);
  console.log("\nRegistered routes:");
  lines.forEach((line) => console.log(`  ${line}`));
  console.log("");
};
